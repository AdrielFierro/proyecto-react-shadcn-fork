import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import Stepper from '../../components/cliente/Stepper';
import { useAuthStore, useReservaStore } from '../../lib/store';
import { sedes, turnos } from '../../lib/data/mockData';
import { User, LogOut, ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Check, AlertCircle, BellOff } from 'lucide-react';
import type { Sede, Turno, Reserva } from '../../types';

const steps = [
  { id: 1, nombre: 'Sede', descripcion: 'Selecciona la sede' },
  { id: 2, nombre: 'Fecha', descripcion: 'Elige la fecha' },
  { id: 3, nombre: 'Turno', descripcion: 'Selecciona el turno' },
  { id: 4, nombre: 'Confirmar', descripcion: 'Revisa y confirma' },
];

export default function NuevaReservaPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const agregarReserva = useReservaStore((state) => state.agregarReserva);

  const [currentStep, setCurrentStep] = useState(1);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<Sede | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<Turno | null>(null);
  const [horaEspecifica, setHoraEspecifica] = useState<string>(''); // '07:00 AM', etc.
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  // Estados para manejo de errores (preparados para integración con backend)
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, _setErrorMessage] = useState('');

  // Horarios disponibles por turno (usando el ID del turno)
  const horariosDisponibles: Record<string, string[]> = {
    '1': ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'], // Desayuno
    '2': ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'], // Almuerzo
    '3': ['04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'], // Merienda
    '4': ['08:00 PM', '09:00 PM', '10:00 PM'], // Cena
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmar = () => {
    if (!user || !sedeSeleccionada || !fechaSeleccionada || !turnoSeleccionado) return;

    // TODO: INTEGRACIÓN CON BACKEND - Descomentar cuando esté disponible la API
    
    // ==================== PASO 1: VALIDAR SALDO ====================
    // const validarSaldo = async () => {
    //   const response = await fetch(`/api/usuarios/${user.id}/saldo`);
    //   const { saldo } = await response.json();
    //   const costResponse = await fetch(`/api/reservas/calcular-costo`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       sedeId: sedeSeleccionada.id,
    //       turnoId: turnoSeleccionado.id,
    //       fecha: fechaSeleccionada
    //     })
    //   });
    //   const { total: costoReserva } = await costResponse.json();
    //   
    //   if (saldo < costoReserva) {
    //     setErrorMessage('No tienes saldo suficiente en tu cuenta para realizar esta reserva.');
    //     setShowErrorDialog(true);
    //     return false;
    //   }
    //   return true;
    // };

    // ==================== PASO 2: VERIFICAR DISPONIBILIDAD ====================
    // const verificarDisponibilidad = async () => {
    //   const response = await fetch('/api/reservas/verificar-disponibilidad', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       sedeId: sedeSeleccionada.id,
    //       fecha: fechaSeleccionada,
    //       turnoId: turnoSeleccionado.id,
    //       hora: horaEspecifica
    //     })
    //   });
    //   const { disponible } = await response.json();
    //   
    //   if (!disponible) {
    //     setErrorMessage('La sede y horario seleccionados ya están completos. Por favor, selecciona otra opción.');
    //     setShowErrorDialog(true);
    //     return false;
    //   }
    //   return true;
    // };

    // ==================== PASO 3: CREAR RESERVA EN BD ====================
    // const crearReservaEnBD = async () => {
    //   const response = await fetch('/api/reservas', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       usuarioId: user.id,
    //       sedeId: sedeSeleccionada.id,
    //       fecha: fechaSeleccionada,
    //       turnoId: turnoSeleccionado.id,
    //       hora: horaEspecifica
    //     })
    //   });
    //   
    //   if (!response.ok) {
    //     const error = await response.json();
    //     setErrorMessage(error.message || 'Error al crear la reserva. Por favor, intenta nuevamente.');
    //     setShowErrorDialog(true);
    //     return null;
    //   }
    //   
    //   return await response.json();
    // };

    // ==================== FLUJO COMPLETO CON API ====================
    // const procesarReserva = async () => {
    //   // Validar saldo
    //   const saldoValido = await validarSaldo();
    //   if (!saldoValido) return;
    //   
    //   // Verificar disponibilidad
    //   const disponibilidadValida = await verificarDisponibilidad();
    //   if (!disponibilidadValida) return;
    //   
    //   // Crear reserva
    //   const reservaCreada = await crearReservaEnBD();
    //   if (reservaCreada) {
    //     setShowSuccessDialog(true);
    //   }
    // };
    // 
    // procesarReserva();

    // ==================== MODO DESARROLLO: Crear reserva localmente ====================
    const costoReserva = 2000; // En producción, esto vendría del cálculo del backend
    
    const nuevaReserva: Reserva = {
      id: `R${String(Date.now()).slice(-3)}`,
      usuarioId: user.id,
      sedeId: sedeSeleccionada.id,
      turnoId: turnoSeleccionado.id,
      fecha: fechaSeleccionada,
      estado: 'pendiente',
      items: [],
      total: costoReserva,
      fechaCreacion: new Date().toISOString(),
    };

    agregarReserva(nuevaReserva);
    setShowSuccessDialog(true);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!sedeSeleccionada;
      case 2:
        return !!fechaSeleccionada;
      case 3:
        return !!turnoSeleccionado && !!horaEspecifica;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Generar fechas disponibles (próximos 14 días)
  const fechasDisponibles = Array.from({ length: 14 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i + 1);
    return fecha.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen bg-[#E8DED4]">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cliente/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Inicio
              </Button>
              <div className="border-l h-8 border-gray-300"></div>
              <div>
                <h1 className="text-base font-semibold text-gray-800">Nueva Reserva</h1>
                <p className="text-xs text-gray-500">Portal del Comensal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-[#8B6F47] text-white hover:bg-[#8B6F47] px-3 py-1.5">
                <User className="w-3 h-3 mr-1.5" />
                {user?.nombre || 'Usuario Comensal'}
              </Badge>
              <Badge className="bg-[#8B6F47] text-white hover:bg-[#8B6F47] px-3 py-1.5">
                COMENSAL
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="container mx-auto px-6 py-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Paso 1: Seleccionar Sede */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1E3A5F]">Selecciona una Sede</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sedes.map((sede) => (
                  <Card
                    key={sede.id}
                    className={`p-6 cursor-pointer transition-all border-2 hover:shadow-lg ${
                      sedeSeleccionada?.id === sede.id
                        ? 'border-[#1E3A5F] bg-blue-50'
                        : 'border-gray-200 hover:border-[#1E3A5F]'
                    }`}
                    onClick={() => setSedeSeleccionada(sede)}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`w-6 h-6 mt-1 ${sedeSeleccionada?.id === sede.id ? 'text-[#1E3A5F]' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#1E3A5F] mb-2">{sede.nombre}</h3>
                        <p className="text-sm text-gray-600 mb-3">{sede.direccion}</p>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="font-semibold">Capacidad:</span> {sede.capacidad} personas</p>
                        </div>
                      </div>
                      {sedeSeleccionada?.id === sede.id && (
                        <Check className="w-6 h-6 text-[#1E3A5F]" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: Seleccionar Fecha */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1E3A5F]">Selecciona una Fecha</h2>
              <div className="max-w-4xl mx-auto">
                <div className="bg-blue-50 border border-[#1E3A5F] rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 text-[#1E3A5F] mb-2">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-semibold">Sede seleccionada:</span>
                  </div>
                  <p className="text-gray-700 ml-7">{sedeSeleccionada?.nombre}</p>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center font-semibold text-[#1E3A5F] py-2">
                      {day}
                    </div>
                  ))}
                  {fechasDisponibles.map((fecha) => {
                    const fechaObj = new Date(fecha + 'T00:00:00');
                    const isSelected = fechaSeleccionada === fecha;
                    
                    return (
                      <button
                        key={fecha}
                        onClick={() => setFechaSeleccionada(fecha)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          isSelected
                            ? 'bg-[#1E3A5F] text-white font-bold'
                            : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-[#1E3A5F]'
                        }`}
                      >
                        <div className="text-lg">{fechaObj.getDate()}</div>
                        <div className="text-xs">{fechaObj.toLocaleDateString('es-ES', { month: 'short' })}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Seleccionar Turno */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Selecciona un Turno</h2>
              
              <div className="grid grid-cols-[300px_1fr] gap-6">
                {/* Lista de turnos a la izquierda */}
                <div className="space-y-3">
                  {turnos.map((turno) => (
                    <button
                      key={turno.id}
                      onClick={() => {
                        setTurnoSeleccionado(turno);
                        setHoraEspecifica(''); // Reset hora al cambiar turno
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        turnoSeleccionado?.id === turno.id
                          ? 'border-[#1E3A5F] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Clock className={`w-5 h-5 ${turnoSeleccionado?.id === turno.id ? 'text-[#1E3A5F]' : 'text-gray-400'}`} />
                      <span className={`font-medium ${turnoSeleccionado?.id === turno.id ? 'text-[#1E3A5F]' : 'text-gray-700'}`}>
                        {turno.nombre}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Horarios específicos a la derecha */}
                <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                  {turnoSeleccionado && horariosDisponibles[turnoSeleccionado.id] ? (
                    <div className="grid grid-cols-2 gap-3">
                      {horariosDisponibles[turnoSeleccionado.id].map((hora) => (
                        <button
                          key={hora}
                          onClick={() => setHoraEspecifica(hora)}
                          className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                            horaEspecifica === hora
                              ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                              : 'border-gray-200 hover:border-[#1E3A5F] bg-white text-gray-700'
                          }`}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p>Selecciona un turno para ver los horarios disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Confirmación */}
          {currentStep === 4 && (
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Selecciona un Turno</h2>
                
                <Card className="border border-gray-300">
                  <CardContent className="p-5">
                    <h3 className="text-base font-semibold text-gray-800 mb-3 pb-3 border-b">Detalles de la Reserva</h3>
                    
                    <div className="grid grid-cols-[1fr_auto] gap-4">
                      {/* Columna izquierda - Detalles compactos */}
                      <div className="space-y-0.5 text-sm">
                        <p className="font-medium text-gray-900">{sedeSeleccionada?.nombre}</p>
                        <p className="text-gray-600 text-xs">{sedeSeleccionada?.direccion}</p>
                        <p className="text-gray-900 text-xs pt-1">
                          {fechaSeleccionada && new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-ES', { 
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })} - {turnoSeleccionado?.nombre}
                        </p>
                        <p className="text-gray-600 text-xs">{horaEspecifica}</p>
                      </div>

                      {/* Columna derecha - Atención compacta */}
                      <div className="flex flex-col items-center justify-start bg-gray-100 rounded-md px-4 py-3 w-[180px]">
                        <AlertCircle className="w-6 h-6 text-gray-500 mb-1.5" />
                        <p className="text-[10px] text-center text-gray-600 leading-tight">
                          Se te devolverá el costo de la reserva al momento de su asistencia
                        </p>
                      </div>
                    </div>

                    {/* Total compacto */}
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-800">Total costo reserva</span>
                      <span className="text-lg font-bold text-gray-900">$ 2,000</span>
                    </div>

                    {/* Botón Confirmar compacto */}
                    <Button
                      onClick={handleConfirmar}
                      disabled={!canProceed()}
                      className="w-full mt-4 bg-[#1E3A5F] hover:bg-[#2a5080] text-white py-2.5 text-sm font-medium"
                    >
                      Confirmar Reserva
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Footer con botones de navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Anterior
            </Button>
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                size="lg"
                className="bg-[#1E3A5F] hover:bg-[#2a5080] text-white"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowSuccessDialog(false)}
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Dialog de Error */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <BellOff className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-red-600">
              Reserva NO creada!
            </DialogTitle>
            <DialogDescription className="text-center text-red-500 mt-2 font-medium">
              ¡Hubo un error!
            </DialogDescription>
            <div className="text-center text-gray-700 mt-3 text-sm">
              {errorMessage}
            </div>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => setShowErrorDialog(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8"
            >
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-[#1E3A5F]">
              ¡Reserva Creada Exitosamente!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              Tu reserva ha sido creada exitosamente. Puedes verla en la sección de "Mis Reservas".
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/menu')}
              className="border-[#1E3A5F] text-[#1E3A5F] hover:bg-blue-50"
            >
              Ver Menú
            </Button>
            <Button 
              onClick={() => navigate('/reservas')}
              className="bg-[#1E3A5F] hover:bg-[#2a5080] text-white"
            >
              Ver Mis Reservas
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

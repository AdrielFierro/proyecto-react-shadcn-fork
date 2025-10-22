import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import Stepper from '../../components/cliente/Stepper';
import SlotCard from '../../components/cliente/SlotCard';
import { useAuthStore, useReservaStore } from '../../lib/store';
import { sedes } from '../../lib/data/mockData';
import { User, LogOut, ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Check, AlertCircle, BellOff } from 'lucide-react';
import type { Sede, Reserva, Meal, TurnoHorario } from '../../types';
import { buildSlotsForMeal, getMealLabel } from '../../lib/utils/slots';

const steps = [
  { id: 1, nombre: 'Sede', descripcion: 'Selecciona la sede' },
  { id: 2, nombre: 'Fecha', descripcion: 'Elige la fecha' },
  { id: 3, nombre: 'Turno', descripcion: 'Selecciona el turno y horario' },
  { id: 4, nombre: 'Confirmar', descripcion: 'Revisa y confirma' },
];

const MEALS: Meal[] = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena'];

export default function NuevaReservaPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { agregarReserva, getSlotCount } = useReservaStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<Sede | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [mealSeleccionado, setMealSeleccionado] = useState<Meal | null>(null);
  const [slotSeleccionado, setSlotSeleccionado] = useState<TurnoHorario | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, _setErrorMessage] = useState('');

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
    if (!user || !sedeSeleccionada || !fechaSeleccionada || !slotSeleccionado) return;

    const costoReserva = 2000;
    
    const nuevaReserva: Reserva = {
      id: `R${String(Date.now()).slice(-3)}`,
      usuarioId: user.id,
      sedeId: sedeSeleccionada.id,
      fecha: fechaSeleccionada,
      estado: 'pendiente',
      items: [],
      total: costoReserva,
      fechaCreacion: new Date().toISOString(),
      meal: slotSeleccionado.meal,
      slotId: slotSeleccionado.id,
      slotStart: slotSeleccionado.start,
      slotEnd: slotSeleccionado.end,
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
        return !!mealSeleccionado && !!slotSeleccionado;
      case 4:
        return true;
      default:
        return false;
    }
  };

  // Generar fechas disponibles (próximos 14 días)
  const generarFechasDisponibles = () => {
    const fechas: Date[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    for (let i = 1; i <= 14; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
      fecha.setHours(0, 0, 0, 0);
      fechas.push(fecha);
    }
    return fechas;
  };

  const fechasDisponibles = generarFechasDisponibles();

  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generar slots cuando se selecciona meal
  const slots = mealSeleccionado && sedeSeleccionada && fechaSeleccionada
    ? buildSlotsForMeal({
        dateYmd: fechaSeleccionada,
        venueId: sedeSeleccionada.id,
        meal: mealSeleccionado,
        venueCapacity: sedeSeleccionada.capacidad,
      })
    : [];

  // Aplicar condición especial: Comedor Sur - Desayuno agotado
  const slotsConOcupacion = slots.map(slot => {
    const baseCount = getSlotCount(slot.id);
    // Si es Comedor Sur (id: '3') y Desayuno, marcar como lleno
    if (sedeSeleccionada?.id === '3' && slot.meal === 'Desayuno') {
      return { ...slot, reservedCount: slot.capacity };
    }
    return { ...slot, reservedCount: baseCount };
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

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="text-center font-semibold text-[#1E3A5F] py-2 text-xs sm:text-sm">
                      {day}
                    </div>
                  ))}
                  
                  {/* Rellenar espacios vacíos hasta el primer día */}
                  {fechasDisponibles.length > 0 && Array.from({ length: fechasDisponibles[0].getDay() }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square"></div>
                  ))}

                  {fechasDisponibles.map((fechaObj) => {
                    const fechaString = dateToString(fechaObj);
                    const isSelected = fechaSeleccionada === fechaString;
                    const isPast = fechaObj < today;
                    
                    return (
                      <button
                        key={fechaString}
                        onClick={() => !isPast && setFechaSeleccionada(fechaString)}
                        disabled={isPast}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg text-center transition-all text-xs sm:text-sm ${
                          isPast
                            ? 'text-gray-400 opacity-60 cursor-not-allowed bg-gray-50'
                            : isSelected
                            ? 'bg-[#1E3A5F] text-white font-bold'
                            : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-[#1E3A5F] cursor-pointer'
                        }`}
                      >
                        <div className="text-base sm:text-lg font-semibold">{fechaObj.getDate()}</div>
                        <div className="text-[10px] sm:text-xs">
                          {fechaObj.toLocaleDateString('es-ES', { month: 'short' })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Seleccionar Meal y Horario */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1E3A5F]">Selecciona Turno y Horario</h2>
              
              <div className="bg-blue-50 border border-[#1E3A5F] rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-[#1E3A5F] text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold">{sedeSeleccionada?.nombre}</span>
                  <span className="text-gray-600">•</span>
                  <CalendarIcon className="w-4 h-4" />
                  <span className="font-semibold">
                    {fechaSeleccionada && (() => {
                      const [year, month, day] = fechaSeleccionada.split('-').map(Number);
                      const fecha = new Date(year, month - 1, day);
                      return fecha.toLocaleDateString('es-ES', { 
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      });
                    })()}
                  </span>
                </div>
              </div>

              {/* Selección de Meal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Selecciona el tipo de comida</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MEALS.map((meal) => (
                    <button
                      key={meal}
                      onClick={() => {
                        setMealSeleccionado(meal);
                        setSlotSeleccionado(null);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all font-medium ${
                        mealSeleccionado === meal
                          ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                          : 'border-gray-200 hover:border-[#1E3A5F] bg-white text-gray-700'
                      }`}
                    >
                      {getMealLabel(meal)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selección de Horario (Slots) */}
              {mealSeleccionado && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    2. Selecciona un horario para {getMealLabel(mealSeleccionado)}
                  </h3>
                  {slotsConOcupacion.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay horarios disponibles</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {slotsConOcupacion.map((slot) => (
                        <SlotCard
                          key={slot.id}
                          slot={slot}
                          isSelected={slotSeleccionado?.id === slot.id}
                          onSelect={setSlotSeleccionado}
                          occupiedCount={slot.reservedCount}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Paso 4: Confirmación */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1E3A5F]">Confirmar Reserva</h2>
              
              <Card className="border border-gray-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
                    Detalles de la Reserva
                  </h3>
                  
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
                    <div className="space-y-3 text-left">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Sede</p>
                        <p className="font-semibold text-gray-900">{sedeSeleccionada?.nombre}</p>
                        <p className="text-sm text-gray-600">{sedeSeleccionada?.direccion}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Fecha</p>
                        <p className="font-semibold text-gray-900">
                          {fechaSeleccionada && (() => {
                            const [year, month, day] = fechaSeleccionada.split('-').map(Number);
                            const fecha = new Date(year, month - 1, day);
                            return fecha.toLocaleDateString('es-ES', { 
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            });
                          })()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Turno</p>
                        <p className="font-semibold text-gray-900">{mealSeleccionado && getMealLabel(mealSeleccionado)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Horario</p>
                        <p className="font-semibold text-gray-900">
                          {slotSeleccionado && `${slotSeleccionado.start} - ${slotSeleccionado.end}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-center justify-start bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <AlertCircle className="w-8 h-8 text-[#1E3A5F] mb-3" />
                      <p className="text-sm text-center text-gray-700 leading-relaxed">
                        Se te devolverá el costo de la reserva al momento de tu asistencia
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-base font-semibold text-gray-800">Total costo reserva</span>
                      <span className="text-2xl font-bold text-[#1E3A5F]">$ 2,000</span>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleConfirmar}
                        disabled={!canProceed()}
                        className="w-full md:w-auto bg-[#1E3A5F] hover:bg-[#2a5080] text-white px-8 py-3"
                      >
                        Confirmar Reserva
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

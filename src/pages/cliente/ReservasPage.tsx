import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { useAuthStore, useReservaStore } from '../../lib/store';
import { MapPin, Clock, AlertTriangle, Plus, ArrowLeft, User, LogOut } from 'lucide-react';
import { sedes, turnos } from '../../lib/data/mockData';
import type { Reserva } from '../../types';

export default function ReservasPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const reservas = useReservaStore((state) => state.reservas);
  const actualizarReserva = useReservaStore((state) => state.actualizarReserva);
  
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);
  const [showCancelarDialog, setShowCancelarDialog] = useState(false);

  // Filtrar reservas del usuario actual que estén activas
  const misReservas = reservas.filter((r) => r.usuarioId === user?.id && r.estado === 'pendiente');

  const handleCancelar = (reserva: Reserva) => {
    setReservaSeleccionada(reserva);
    setShowCancelarDialog(true);
  };

  const confirmarCancelacion = () => {
    if (reservaSeleccionada) {
      actualizarReserva(reservaSeleccionada.id, { estado: 'cancelada' });
      setShowCancelarDialog(false);
      setReservaSeleccionada(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSede = (sedeId: string) => sedes.find((s) => s.id === sedeId);
  const getTurno = (turnoId: string) => turnos.find((t) => t.id === turnoId);
  
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${dias[date.getDay()]}, ${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-[#E8DED4]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-700 hover:bg-gray-100 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Inicio
            </Button>
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-lg font-bold text-gray-900">Mis Reservas</h1>
              <p className="text-xs text-gray-500">Portal del Comensal</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Usuario Comensal</span>
            </div>
            <Badge className="bg-[#8B6F47] text-white hover:bg-[#8B6F47] px-3 py-1">
              comensal
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F] mb-1">Mis Reservas</h1>
            <p className="text-sm text-gray-600">Gestiona tus reservas activas</p>
          </div>
          <Button 
            onClick={() => navigate('/nueva-reserva')}
            className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Reserva
          </Button>
        </div>

        {/* Reservas Grid */}
        {misReservas.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No tienes reservas activas</h3>
                <p className="text-gray-500 mb-6">Crea tu primera reserva para comenzar</p>
                <Button onClick={() => navigate('/nueva-reserva')} className="bg-[#1E3A5F]">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Reserva
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {misReservas.map((reserva) => {
              const sede = getSede(reserva.sedeId);
              const turno = getTurno(reserva.turnoId);
              
              return (
                <Card key={reserva.id} className="bg-white shadow-sm">
                  <CardContent className="p-6">
                    {/* Header de la Card */}
                    <div className="mb-4">
                      <h3 className="font-bold text-base text-[#1E3A5F] mb-1">Reserva #{reserva.id}</h3>
                      <p className="text-sm text-gray-500">{formatearFecha(reserva.fecha)}</p>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 text-green-700 hover:bg-green-100 mt-2"
                      >
                        Activa
                      </Badge>
                    </div>

                    {/* Información de Sede y Horario */}
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#1E3A5F] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-[#1E3A5F]">Sede y Horario</p>
                          <p className="text-gray-700">{sede?.nombre}</p>
                          <p className="text-gray-500 text-xs">{sede?.direccion}</p>
                          <p className="text-gray-700 mt-1">
                            {turno?.nombre} - (12:00 PM a 01:00 PM)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-3">
                      <Button
                        variant="destructive"
                        className="flex-1 bg-red-500 hover:bg-red-600 text-sm"
                        onClick={() => handleCancelar(reserva)}
                      >
                        Cancelar Reserva
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                        onClick={() => navigate(`/modificar-reserva/${reserva.id}`)}
                      >
                        Modificar Reserva
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Información Importante */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base mb-2">Información Importante</h3>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">Políticas de Reserva</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>El pago se realiza al momento de la confirmación</li>
                    <li>Cancelaciones gratuitas hasta 24 horas antes, luego se cobra el 50% del valor de la reserva.</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog de Cancelación */}
      <Dialog open={showCancelarDialog} onOpenChange={setShowCancelarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowCancelarDialog(false)}>
              No, mantener
            </Button>
            <Button variant="destructive" onClick={confirmarCancelacion}>
              Sí, cancelar reserva
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Menu, Calendar, ClipboardList } from 'lucide-react';

export default function ClienteDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#E8DED4] min-h-[calc(100vh-4rem)]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#1E3A5F] mb-4">
              Bienvenido al Sistema de Reservas
            </h1>
            <p className="text-gray-600">Selecciona una opción para comenzar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ver Menú */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none" onClick={() => navigate('/menu')}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-[#1E3A5F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Menu className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-[#1E3A5F]">Ver Menú</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Consulta nuestro menú del día y opciones disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full bg-[#1E3A5F] hover:bg-[#2d5585] text-white"
                  onClick={() => navigate('/menu')}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* Reservar */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none" onClick={() => navigate('/nueva-reserva')}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-[#8B6F47] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-[#1E3A5F]">Reservar</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Haz una nueva reserva seleccionando sede, horario y menú
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full bg-[#1E3A5F] hover:bg-[#2d5585] text-white"
                  onClick={() => navigate('/nueva-reserva')}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>

            {/* Mis Reservas */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-none" onClick={() => navigate('/reservas')}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-[#8B6F47] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-[#1E3A5F]">Mis Reservas</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Consulta y gestiona tus reservas activas
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full bg-[#1E3A5F] hover:bg-[#2d5585] text-white"
                  onClick={() => navigate('/reservas')}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Información de Sedes */}
          <Card className="mt-12 border-none">
            <CardHeader>
              <CardTitle className="text-[#1E3A5F]">Información de Sedes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#1E3A5F] mb-2">Sede Centro</h3>
                  <p className="text-sm text-gray-600 mb-1">Calle Principal 123</p>
                  <p className="text-sm text-gray-600">
                    Horarios: 12:00 - 15:00 / 19:00 - 22:00
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E3A5F] mb-2">Sede Norte</h3>
                  <p className="text-sm text-gray-600 mb-1">Avenida Norte 456</p>
                  <p className="text-sm text-gray-600">
                    Horarios: 12:00 - 15:00 / 19:00 - 22:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

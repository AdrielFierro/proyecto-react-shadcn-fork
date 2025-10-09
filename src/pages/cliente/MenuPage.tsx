import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { User, LogOut, Clock, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { consumibles } from '../../lib/data/mockData';

const horarios = [
  { id: 'desayuno', nombre: 'Desayuno', horario: '07:00-11:00' },
  { id: 'almuerzo', nombre: 'Almuerzo', horario: '12:00-15:00' },
  { id: 'merienda', nombre: 'Merienda', horario: '16:00-19:00' },
  { id: 'cena', nombre: 'Cena', horario: '20:00-22:00' },
];

const sedes = [
  { id: 1, nombre: 'Sede Centro', direccion: 'Calle Principal 123', capacidad: 50 },
  { id: 2, nombre: 'Sede Norte', direccion: 'Avenida Norte 456', capacidad: 40 },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const platos = consumibles.filter(c => c.tipo === 'plato');
  const bebidas = consumibles.filter(c => c.tipo === 'bebida');
  const postres = consumibles.filter(c => c.tipo === 'postre');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
                <h1 className="text-base font-semibold text-gray-800">Menú del Día</h1>
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

      <main className="container mx-auto px-6 py-8">
        {/* Menú Disponible */}
        <Card className="bg-white border-0 shadow-md mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Menú Disponible</h2>
            <p className="text-sm text-gray-600 mb-4">Consulta nuestras opciones del día</p>
            
            {/* Horarios de Servicio */}
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Horarios de Servicio</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {horarios.map((horario) => (
                <div key={horario.id} className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-semibold text-sm text-gray-800">{horario.nombre}</p>
                  <p className="text-xs text-gray-600 mt-1">{horario.horario}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sedes Disponibles */}
        <Card className="bg-white border-0 shadow-md mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sedes Disponibles</h2>
            <div className="grid grid-cols-2 gap-4">
              {sedes.map((sede) => (
                <div key={sede.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800">{sede.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-1">{sede.direccion}</p>
                  <p className="text-sm text-gray-600">Capacidad: {sede.capacidad} personas</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Menú */}
        <Tabs defaultValue="platos" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="platos">Platos Principales</TabsTrigger>
            <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
            <TabsTrigger value="postres">Postres</TabsTrigger>
          </TabsList>

          <TabsContent value="platos">
            <div className="grid grid-cols-3 gap-4">
              {platos.map((plato) => (
                <Card key={plato.id} className="bg-white border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{plato.nombre}</h3>
                      <Badge className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]">
                        ${plato.precio.toFixed(3)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{plato.descripcion}</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Disponible
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bebidas">
            <div className="grid grid-cols-3 gap-4">
              {bebidas.map((bebida) => (
                <Card key={bebida.id} className="bg-white border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{bebida.nombre}</h3>
                      <Badge className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]">
                        ${bebida.precio.toFixed(3)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{bebida.descripcion}</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Disponible
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="postres">
            <div className="grid grid-cols-3 gap-4">
              {postres.map((postre) => (
                <Card key={postre.id} className="bg-white border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{postre.nombre}</h3>
                      <Badge className="bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]">
                        ${postre.precio.toFixed(3)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{postre.descripcion}</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Disponible
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Sección final - Hacer Reserva */}
        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Listo para hacer tu reserva?</h2>
            <p className="text-gray-600 mb-6">Selecciona tu sede, horario y menú favorito</p>
            <Button 
              onClick={() => navigate('/cliente/nueva-reserva')}
              className="bg-[#1E3A5F] hover:bg-[#2A4A7F] text-white px-8 py-6 text-lg"
            >
              Hacer Reserva
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { User, LogOut, Home, Edit, Plus, CirclePlus, CircleMinus } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { consumibles } from '../../lib/data/mockData';

interface MenuAsignado {
  platos: string[];
  bebidas: string[];
  postres: string[];
  precioTotal: number;
}

type DiaSemana = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes';
type TurnoId = 'desayuno' | 'almuerzo' | 'merienda' | 'cena';

interface Turno {
  id: TurnoId;
  nombre: string;
  horario: string;
}

const turnos: Turno[] = [
  { id: 'desayuno', nombre: 'Desayuno', horario: '07:00-11:00' },
  { id: 'almuerzo', nombre: 'Almuerzo', horario: '12:00-15:00' },
  { id: 'merienda', nombre: 'Merienda', horario: '16:00-19:00' },
  { id: 'cena', nombre: 'Cena', horario: '20:00-22:00' },
];

const dias: DiaSemana[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];

export default function GestionSemanalChef() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  // Actualizado: Modal con diseño horizontal compacto
  
  const [menusSemana, setMenusSemana] = useState<Record<TurnoId, Record<DiaSemana, MenuAsignado | null>>>({
    desayuno: {
      lunes: { platos: ['Fideos con carne'], bebidas: [], postres: ['Helado'], precioTotal: 24.000 },
      martes: null,
      miércoles: null,
      jueves: null,
      viernes: null,
    },
    almuerzo: {
      lunes: { platos: ['Pollo a la Plancha'], bebidas: [], postres: ['Helado'], precioTotal: 24.000 },
      martes: null,
      miércoles: null,
      jueves: null,
      viernes: null,
    },
    merienda: {
      lunes: { platos: [], bebidas: [], postres: [], precioTotal: 0 },
      martes: null,
      miércoles: null,
      jueves: null,
      viernes: null,
    },
    cena: {
      lunes: { platos: ['Milanesa con Pure'], bebidas: [], postres: ['Helado'], precioTotal: 24.000 },
      martes: null,
      miércoles: null,
      jueves: null,
      viernes: null,
    },
  });

  const [showDialog, setShowDialog] = useState(false);
  const [editingCell, setEditingCell] = useState<{ turno: TurnoId; dia: DiaSemana } | null>(null);
  const [selectedItems, setSelectedItems] = useState<{
    platos: string[];
    bebidas: string[];
    postres: string[];
  }>({
    platos: [],
    bebidas: [],
    postres: [],
  });

  const [selectedItemsInList, setSelectedItemsInList] = useState<{
    disponibles: string | null;
    seleccionados: string | null;
  }>({
    disponibles: null,
    seleccionados: null,
  });

  const allPlatos = consumibles.filter(c => c.tipo === 'plato');
  const allBebidas = consumibles.filter(c => c.tipo === 'bebida');
  const allPostres = consumibles.filter(c => c.tipo === 'postre');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAsignarMenu = (turno: TurnoId, dia: DiaSemana) => {
    setEditingCell({ turno, dia });
    const menuActual = menusSemana[turno][dia];
    setSelectedItems({
      platos: menuActual?.platos || [],
      bebidas: menuActual?.bebidas || [],
      postres: menuActual?.postres || [],
    });
    setSelectedItemsInList({
      disponibles: null,
      seleccionados: null,
    });
    setShowDialog(true);
  };

  const moverASeleccionados = (tipo: 'platos' | 'bebidas' | 'postres') => {
    const item = selectedItemsInList.disponibles;
    if (!item) return;

    setSelectedItems(prev => ({
      ...prev,
      [tipo]: [...prev[tipo], item]
    }));

    setSelectedItemsInList({
      disponibles: null,
      seleccionados: null,
    });
  };

  const moverADisponibles = (tipo: 'platos' | 'bebidas' | 'postres') => {
    const item = selectedItemsInList.seleccionados;
    if (!item) return;

    setSelectedItems(prev => ({
      ...prev,
      [tipo]: prev[tipo].filter(i => i !== item)
    }));

    setSelectedItemsInList({
      disponibles: null,
      seleccionados: null,
    });
  };

  const handleGuardarMenu = () => {
    if (!editingCell) return;

    const precioTotal = [
      ...selectedItems.platos.map(nombre => consumibles.find(c => c.nombre === nombre)?.precio || 0),
      ...selectedItems.bebidas.map(nombre => consumibles.find(c => c.nombre === nombre)?.precio || 0),
      ...selectedItems.postres.map(nombre => consumibles.find(c => c.nombre === nombre)?.precio || 0),
    ].reduce((sum, precio) => sum + precio, 0);

    setMenusSemana(prev => ({
      ...prev,
      [editingCell.turno]: {
        ...prev[editingCell.turno],
        [editingCell.dia]: {
          platos: selectedItems.platos,
          bebidas: selectedItems.bebidas,
          postres: selectedItems.postres,
          precioTotal,
        },
      },
    }));

    setShowDialog(false);
    setEditingCell(null);
  };

  const getDisponibles = (tipo: 'platos' | 'bebidas' | 'postres') => {
    const all = tipo === 'platos' ? allPlatos : tipo === 'bebidas' ? allBebidas : allPostres;
    return all.filter(item => !selectedItems[tipo].includes(item.nombre));
  };

  const getSeleccionados = (tipo: 'platos' | 'bebidas' | 'postres') => {
    const all = tipo === 'platos' ? allPlatos : tipo === 'bebidas' ? allBebidas : allPostres;
    return all.filter(item => selectedItems[tipo].includes(item.nombre));
  };

  const formatMenuDisplay = (menu: MenuAsignado) => {
    const items = [...menu.platos, ...menu.bebidas, ...menu.postres];
    if (items.length === 0) return 'Sin items';
    if (items.length <= 2) return items.join(', ');
    return `${items[0]}, ${items[1]}...`;
  };

  return (
    <div className="min-h-screen bg-[#E8DED4]">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/chef/dashboard')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Inicio
              </Button>
              <div className="border-l h-8 border-gray-300"></div>
              <div>
                <h1 className="text-base font-semibold text-gray-800">Gestión Semanal de Menús</h1>
                <p className="text-xs text-gray-500">Sistema del Chef</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-[#8B6F47] text-white hover:bg-[#8B6F47] px-3 py-1.5">
                <User className="w-3 h-3 mr-1.5" />
                {user?.nombre || 'Chef Demo'}
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Planificación Semanal</h2>
          <p className="text-sm text-gray-600 mt-1">Gestiona los menús por día y turno</p>
        </div>

        <Card className="bg-white border-0 shadow-md overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Menú de la Semana Actual</h3>
            <p className="text-sm text-gray-600 mb-6">Día / Turno</p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 bg-gray-50 p-3 text-left min-w-[150px]"></th>
                    {dias.map((dia) => (
                      <th key={dia} className="border border-gray-300 bg-gray-50 p-3 text-center min-w-[180px]">
                        <div className="font-semibold text-gray-700 capitalize">{dia}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {turnos.map((turno) => (
                    <tr key={turno.id}>
                      <td className="border border-gray-300 bg-gray-50 p-4">
                        <div className="font-semibold text-gray-700">{turno.nombre}</div>
                        <div className="text-xs text-gray-500">{turno.horario}</div>
                      </td>
                      {dias.map((dia) => {
                        const menu = menusSemana[turno.id][dia];
                        const hasItems = menu && (menu.platos.length > 0 || menu.bebidas.length > 0 || menu.postres.length > 0);
                        
                        return (
                          <td key={dia} className="border border-gray-300 p-3 align-top">
                            {hasItems ? (
                              <div className="space-y-2">
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">{turno.nombre}</p>
                                  <p className="text-sm text-gray-700 mt-1">{formatMenuDisplay(menu!)}</p>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    $ {menu!.precioTotal.toFixed(3)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAsignarMenu(turno.id, dia)}
                                  className="w-full"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                </Button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAsignarMenu(turno.id, dia)}
                                className="w-full h-full min-h-[80px] flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-5 h-5 mb-1" />
                                <span className="text-xs">Sin asignar</span>
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Dialog de Asignar/Editar Menú */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingCell && `Editar Menú - ${editingCell.dia.charAt(0).toUpperCase() + editingCell.dia.slice(1)} ${turnos.find(t => t.id === editingCell.turno)?.nombre}`}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Selecciona los consumibles para este día y turno
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="platos" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="platos">Platos Principales</TabsTrigger>
              <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
              <TabsTrigger value="postres">Postres</TabsTrigger>
            </TabsList>

            {/* Tab de Platos */}
            <TabsContent value="platos" className="mt-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-6">
                {/* Disponibles */}
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-700 mb-3 text-center">Disponibles</h3>
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {getDisponibles('platos').map((plato) => (
                        <button
                          key={plato.id}
                          onClick={() => setSelectedItemsInList({ disponibles: plato.nombre, seleccionados: null })}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedItemsInList.disponibles === plato.nombre
                              ? 'bg-blue-100 border border-blue-400'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {plato.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botones centrales */}
                <div className="flex flex-col items-center justify-center gap-2 pt-8">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moverASeleccionados('platos')}
                    disabled={!selectedItemsInList.disponibles}
                    className="rounded-full h-10 w-10"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moverADisponibles('platos')}
                    disabled={!selectedItemsInList.seleccionados}
                    className="rounded-full h-10 w-10"
                  >
                    <CircleMinus className="w-5 h-5" />
                  </Button>
                </div>

                {/* Seleccionados */}
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-700 mb-3 text-center">Seleccionados</h3>
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {getSeleccionados('platos').map((plato) => (
                        <button
                          key={plato.id}
                          onClick={() => setSelectedItemsInList({ disponibles: null, seleccionados: plato.nombre })}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedItemsInList.seleccionados === plato.nombre
                              ? 'bg-blue-100 border border-blue-400'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {plato.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab de Bebidas */}
            <TabsContent value="bebidas" className="mt-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-6">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-700 mb-3 text-center">Disponibles</h3>
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {getDisponibles('bebidas').map((bebida) => (
                        <button
                          key={bebida.id}
                          onClick={() => setSelectedItemsInList({ disponibles: bebida.nombre, seleccionados: null })}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedItemsInList.disponibles === bebida.nombre
                              ? 'bg-blue-100 border border-blue-400'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {bebida.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 pt-8">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moverASeleccionados('bebidas')}
                    disabled={!selectedItemsInList.disponibles}
                    className="rounded-full h-10 w-10"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moverADisponibles('bebidas')}
                    disabled={!selectedItemsInList.seleccionados}
                    className="rounded-full h-10 w-10"
                  >
                    <CircleMinus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-700 mb-3 text-center">Seleccionados</h3>
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {getSeleccionados('bebidas').map((bebida) => (
                        <button
                          key={bebida.id}
                          onClick={() => setSelectedItemsInList({ disponibles: null, seleccionados: bebida.nombre })}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedItemsInList.seleccionados === bebida.nombre
                              ? 'bg-blue-100 border border-blue-400'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {bebida.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab de Postres */}
            <TabsContent value="postres" className="mt-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-6">
                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-700 mb-3 text-center">Disponibles</h3>
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {getDisponibles('postres').map((postre) => (
                        <button
                          key={postre.id}
                          onClick={() => setSelectedItemsInList({ disponibles: postre.nombre, seleccionados: null })}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedItemsInList.disponibles === postre.nombre
                              ? 'bg-blue-100 border border-blue-400'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {postre.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 pt-8">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moverASeleccionados('postres')}
                    disabled={!selectedItemsInList.disponibles}
                    className="rounded-full h-10 w-10"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moverADisponibles('postres')}
                    disabled={!selectedItemsInList.seleccionados}
                    className="rounded-full h-10 w-10"
                  >
                    <CircleMinus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-semibold text-gray-700 mb-3 text-center">Seleccionados</h3>
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      {getSeleccionados('postres').map((postre) => (
                        <button
                          key={postre.id}
                          onClick={() => setSelectedItemsInList({ disponibles: null, seleccionados: postre.nombre })}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            selectedItemsInList.seleccionados === postre.nombre
                              ? 'bg-blue-100 border border-blue-400'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {postre.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGuardarMenu}
              className="bg-[#1E3A5F] hover:bg-[#2A4A7F] text-white"
            >
              Guardar Menú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

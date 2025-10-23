import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { User, LogOut, Home, Edit, Plus, CirclePlus, CircleMinus, Trash2 } from 'lucide-react';
import {
  useAuthStore,
  useChefConsumiblesStore,
  useChefMenuStore,
  CHEF_DIAS,
  type ChefMenuAsignado,
  type ChefDia,
  type ChefTurnoId,
} from '../../lib/store';
import type { Consumible } from '../../types';

type DiaSemana = ChefDia;
type TurnoId = ChefTurnoId;

interface Turno {
  id: TurnoId;
  nombre: string;
  horario: string;
}

type TabKey = 'platos' | 'bebidas' | 'postres';
type SelectionState = Record<TabKey, string[]>;

const TURNOS: Turno[] = [
  { id: 'desayuno', nombre: 'Desayuno', horario: '07:00-11:00' },
  { id: 'almuerzo', nombre: 'Almuerzo', horario: '12:00-15:00' },
  { id: 'merienda', nombre: 'Merienda', horario: '16:00-19:00' },
  { id: 'cena', nombre: 'Cena', horario: '20:00-22:00' },
];

const DIA_LABELS: Record<DiaSemana, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
};

const TIPO_BY_TAB: Record<TabKey, Consumible['tipo']> = {
  platos: 'plato',
  bebidas: 'bebida',
  postres: 'postre',
};

const createEmptySelection = (): SelectionState => ({
  platos: [],
  bebidas: [],
  postres: [],
});

export default function GestionSemanalChef() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const menusSemana = useChefMenuStore((state) => state.menusSemana);
  const assignMenu = useChefMenuStore((state) => state.assignMenu);
  const clearMenu = useChefMenuStore((state) => state.clearMenu);
  const consumibles = useChefConsumiblesStore((state) => state.consumibles);

  const consumiblesMap = useMemo(() => {
    const map = new Map<string, Consumible>();
    consumibles.forEach((item) => map.set(item.id, item));
    return map;
  }, [consumibles]);

  const consumiblesPorTipo = useMemo<Record<Consumible['tipo'], Consumible[]>>(
    () => ({
      plato: consumibles.filter((c) => c.tipo === 'plato'),
      bebida: consumibles.filter((c) => c.tipo === 'bebida'),
      postre: consumibles.filter((c) => c.tipo === 'postre'),
    }),
    [consumibles]
  );

  const [showDialog, setShowDialog] = useState(false);
  const [editingCell, setEditingCell] = useState<{ turno: TurnoId; dia: DiaSemana } | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectionState>(() => createEmptySelection());
  const [listSelection, setListSelection] = useState<{ disponibles: string | null; seleccionados: string | null }>({
    disponibles: null,
    seleccionados: null,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAsignarMenu = (turno: TurnoId, dia: DiaSemana) => {
    const menuActual = menusSemana[turno][dia];

    setEditingCell({ turno, dia });
    setSelectedItems({
      platos: [...(menuActual?.platoIds ?? [])],
      bebidas: [...(menuActual?.bebidaIds ?? [])],
      postres: [...(menuActual?.postreIds ?? [])],
    });
    setListSelection({ disponibles: null, seleccionados: null });
    setShowDialog(true);
  };

  const handleDialogToggle = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      setEditingCell(null);
      setSelectedItems(createEmptySelection());
      setListSelection({ disponibles: null, seleccionados: null });
    }
  };

  const moverASeleccionados = (tab: TabKey) => {
    const id = listSelection.disponibles;
    if (!id) return;

    setSelectedItems((prev) => {
      if (prev[tab].includes(id)) {
        return prev;
      }
      return {
        ...prev,
        [tab]: [...prev[tab], id],
      };
    });

    setListSelection({ disponibles: null, seleccionados: null });
  };

  const moverADisponibles = (tab: TabKey) => {
    const id = listSelection.seleccionados;
    if (!id) return;

    setSelectedItems((prev) => ({
      ...prev,
      [tab]: prev[tab].filter((itemId) => itemId !== id),
    }));

    setListSelection({ disponibles: null, seleccionados: null });
  };

  const getDisponibles = (tab: TabKey) => {
    const all = consumiblesPorTipo[TIPO_BY_TAB[tab]];
    const selected = new Set(selectedItems[tab]);
    return all.filter((item) => !selected.has(item.id));
  };

  const getSeleccionados = (tab: TabKey) => {
    return selectedItems[tab]
      .map((id) => consumiblesMap.get(id))
      .filter((item): item is Consumible => Boolean(item));
  };

  const calcularPrecioSeleccionado = (selection: SelectionState) => {
    return [...selection.platos, ...selection.bebidas, ...selection.postres]
      .map((id) => consumiblesMap.get(id)?.precio ?? 0)
      .reduce((sum, precio) => sum + precio, 0);
  };

  const formatMenuDisplay = (menu: ChefMenuAsignado) => {
    const secciones: string[] = [];

    const platos = menu.platoIds
      .map((id) => consumiblesMap.get(id)?.nombre)
      .filter((nombre): nombre is string => Boolean(nombre));
    if (platos.length) {
      secciones.push(`Platos: ${platos.join(', ')}`);
    }

    const bebidas = menu.bebidaIds
      .map((id) => consumiblesMap.get(id)?.nombre)
      .filter((nombre): nombre is string => Boolean(nombre));
    if (bebidas.length) {
      secciones.push(`Bebidas: ${bebidas.join(', ')}`);
    }

    const postres = menu.postreIds
      .map((id) => consumiblesMap.get(id)?.nombre)
      .filter((nombre): nombre is string => Boolean(nombre));
    if (postres.length) {
      secciones.push(`Postres: ${postres.join(', ')}`);
    }

    return secciones.length ? secciones.join(' | ') : 'Sin consumibles asignados';
  };

  const calcularPrecioMenu = (menu: ChefMenuAsignado) => {
    return [...menu.platoIds, ...menu.bebidaIds, ...menu.postreIds]
      .map((id) => consumiblesMap.get(id)?.precio ?? 0)
      .reduce((sum, precio) => sum + precio, 0);
  };

  const handleGuardarMenu = () => {
    if (!editingCell) return;

    assignMenu(editingCell.turno, editingCell.dia, {
      platoIds: selectedItems.platos,
      bebidaIds: selectedItems.bebidas,
      postreIds: selectedItems.postres,
    });

    handleDialogToggle(false);
  };

  const handleLimpiarMenu = () => {
    if (!editingCell) return;

    clearMenu(editingCell.turno, editingCell.dia);
    handleDialogToggle(false);
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
              <div className="border-l h-8 border-gray-300" />
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
                    <th className="border border-gray-300 bg-gray-50 p-3 text-left min-w-[150px]" />
                    {CHEF_DIAS.map((dia) => (
                      <th key={dia} className="border border-gray-300 bg-gray-50 p-3 text-center min-w-[180px]">
                        <div className="font-semibold text-gray-700 capitalize">{DIA_LABELS[dia]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TURNOS.map((turno) => (
                    <tr key={turno.id}>
                      <td className="border border-gray-300 bg-gray-50 p-4">
                        <div className="font-semibold text-gray-700">{turno.nombre}</div>
                        <div className="text-xs text-gray-500">{turno.horario}</div>
                      </td>
                      {CHEF_DIAS.map((dia) => {
                        const menu = menusSemana[turno.id][dia];
                        const hasItems = Boolean(
                          menu && (menu.platoIds.length + menu.bebidaIds.length + menu.postreIds.length > 0)
                        );
                        const precioTotal = menu ? calcularPrecioMenu(menu) : 0;

                        return (
                          <td key={dia} className="border border-gray-300 p-3 align-top">
                            {hasItems ? (
                              <div className="space-y-2">
                                <div>
                                  <p className="font-semibold text-gray-800 text-sm">{turno.nombre}</p>
                                  <p className="text-sm text-gray-700 mt-1">{menu && formatMenuDisplay(menu)}</p>
                                  <p className="text-sm font-semibold text-gray-800 mt-1">
                                    $ {precioTotal.toFixed(2)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAsignarMenu(turno.id, dia)}
                                  className="w-full"
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Editar
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

      <Dialog open={showDialog} onOpenChange={handleDialogToggle}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingCell && `Editar Menú - ${DIA_LABELS[editingCell.dia]} ${TURNOS.find((t) => t.id === editingCell.turno)?.nombre ?? ''}`}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Selecciona los consumibles para este día y turno. El precio total se calcula automáticamente con los consumibles actuales.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>Precio estimado del menú:</span>
            <span className="font-semibold text-gray-900">
              $ {calcularPrecioSeleccionado(selectedItems).toFixed(2)}
            </span>
          </div>

          <Tabs defaultValue="platos" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="platos">Platos Principales</TabsTrigger>
              <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
              <TabsTrigger value="postres">Postres</TabsTrigger>
            </TabsList>

            {(['platos', 'bebidas', 'postres'] as TabKey[]).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                <div className="grid grid-cols-[1fr_auto_1fr] gap-6">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-700 mb-3 text-center">Disponibles</h3>
                    <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                      <div className="space-y-2">
                        {getDisponibles(tab).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setListSelection({ disponibles: item.id, seleccionados: null })}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              listSelection.disponibles === item.id
                                ? 'bg-blue-100 border border-blue-400'
                                : 'bg-white hover:bg-gray-100'
                            }`}
                          >
                            {item.nombre}
                          </button>
                        ))}
                        {!getDisponibles(tab).length && (
                          <p className="text-xs text-center text-gray-400">Sin consumibles disponibles</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2 pt-8">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => moverASeleccionados(tab)}
                      disabled={!listSelection.disponibles}
                      className="rounded-full h-10 w-10"
                    >
                      <CirclePlus className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => moverADisponibles(tab)}
                      disabled={!listSelection.seleccionados}
                      className="rounded-full h-10 w-10"
                    >
                      <CircleMinus className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-700 mb-3 text-center">Seleccionados</h3>
                    <div className="border rounded-lg p-3 bg-gray-50 min-h-[300px] max-h-[300px] overflow-y-auto">
                      <div className="space-y-2">
                        {getSeleccionados(tab).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setListSelection({ disponibles: null, seleccionados: item.id })}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              listSelection.seleccionados === item.id
                                ? 'bg-blue-100 border border-blue-400'
                                : 'bg-white hover:bg-gray-100'
                            }`}
                          >
                            {item.nombre}
                          </button>
                        ))}
                        {!getSeleccionados(tab).length && (
                          <p className="text-xs text-center text-gray-400">Aún no hay seleccionados</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <DialogFooter className="mt-6 space-x-2">
            <Button variant="outline" onClick={() => handleDialogToggle(false)}>
              Cancelar
            </Button>
            <Button
              variant="ghost"
              onClick={handleLimpiarMenu}
              disabled={!editingCell}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar menú
            </Button>
            <Button onClick={handleGuardarMenu} className="bg-[#1E3A5F] hover:bg-[#2A4A7F]">
              Guardar Menú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export type UserRole = 'cliente' | 'chef' | 'cajero';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar?: string;
}

export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  capacidad: number;
  imagen?: string;
}

export type Meal = 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';

export interface Turno {
  id: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  capacidad: number;
  sedeId: string;
  fecha: string;
  meal: 'desayuno' | 'almuerzo' | 'merienda' | 'cena';
  reservedCount: number;
}

export interface TurnoHorario {
  id: string;              // ej: "slot-2025-10-23_sede-1_07:00-08:00"
  venueId: string;         // sede seleccionada
  date: string;            // "YYYY-MM-DD"
  meal: Meal;
  start: string;           // "HH:mm"
  end: string;             // "HH:mm"
  capacity: number;        // capacidad de la sede
  reservedCount: number;   // ocupación actual del slot
}

export interface Consumible {
  id: string;
  nombre: string;
  tipo: 'plato' | 'bebida' | 'postre';
  descripcion: string;
  precio: number;
  imagen?: string;
  disponible: boolean;
  categoria?: string;
}

export interface ItemPedido {
  consumibleId: string;
  consumible: Consumible;
  cantidad: number;
}

export interface Reserva {
  id: string;
  usuarioId: string;
  usuario?: User;
  sedeId: string;
  sede?: Sede;
  turnoId?: string;
  turno?: Turno;
  fecha: string;
  estado: 'pendiente' | 'confirmada' | 'pagada' | 'cancelada';
  items: ItemPedido[];
  total: number;
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia';
  fechaCreacion: string;
  // Nuevos campos para slots
  meal?: Meal;
  slotId?: string;
  slotStart?: string;
  slotEnd?: string;
}

export interface MenuDia {
  id: string;
  fecha: string;
  turnoId: string;
  platos: Consumible[];
  bebidas: Consumible[];
  postres: Consumible[];
}

export interface MenuSemanal {
  sedeId: string;
  semana: string; // ISO week date
  dias: {
    [dia: string]: { // 'lunes', 'martes', etc.
      [turnoId: string]: {
        platoIds: string[];
        bebidaIds: string[];
        postreIds: string[];
      };
    };
  };
}

export type DiaSemana = 'lunes' | 'martes' | 'miércoles' | 'jueves' | 'viernes' | 'sábado' | 'domingo';

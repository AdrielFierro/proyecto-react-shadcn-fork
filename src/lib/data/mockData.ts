import type { Sede, Turno, Consumible, Reserva, User } from '../../types';

export const sedes: Sede[] = [
  {
    id: '1',
    nombre: 'Comedor Central',
    direccion: 'Av. Principal 123',
    capacidad: 100,
    imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  },
  {
    id: '2',
    nombre: 'Comedor Norte',
    direccion: 'Calle Norte 456',
    capacidad: 80,
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
  },
  {
    id: '3',
    nombre: 'Comedor Sur',
    direccion: 'Av. Sur 789',
    capacidad: 60,
    imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  },
];

export const turnos: Turno[] = [
  {
    id: '1',
    nombre: 'Desayuno',
    horaInicio: '07:00',
    horaFin: '09:00',
    capacidad: 50,
  },
  {
    id: '2',
    nombre: 'Almuerzo',
    horaInicio: '12:00',
    horaFin: '14:30',
    capacidad: 100,
  },
  {
    id: '3',
    nombre: 'Merienda',
    horaInicio: '16:00',
    horaFin: '18:00',
    capacidad: 40,
  },
  {
    id: '4',
    nombre: 'Cena',
    horaInicio: '20:00',
    horaFin: '22:00',
    capacidad: 80,
  },
];

export const consumibles: Consumible[] = [
  // Platos
  {
    id: '1',
    nombre: 'Milanesa con Puré',
    tipo: 'plato',
    descripcion: 'Milanesa de ternera con puré de papas casero',
    precio: 850,
    imagen: 'https://images.unsplash.com/photo-1588347818036-8e6d36ce4b43?w=300',
    disponible: true,
    categoria: 'Principal',
  },
  {
    id: '2',
    nombre: 'Ensalada César',
    tipo: 'plato',
    descripcion: 'Lechuga romana, pollo grillado, crutones y aderezo césar',
    precio: 750,
    imagen: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
    disponible: true,
    categoria: 'Ensaladas',
  },
  {
    id: '3',
    nombre: 'Pasta Carbonara',
    tipo: 'plato',
    descripcion: 'Fetuccini con salsa carbonara y panceta',
    precio: 900,
    imagen: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300',
    disponible: true,
    categoria: 'Pastas',
  },
  {
    id: '4',
    nombre: 'Pollo al Horno',
    tipo: 'plato',
    descripcion: 'Cuarto de pollo con papas y verduras asadas',
    precio: 950,
    imagen: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300',
    disponible: true,
    categoria: 'Principal',
  },
  {
    id: '5',
    nombre: 'Pizza Margarita',
    tipo: 'plato',
    descripcion: 'Pizza con salsa de tomate, mozzarella y albahaca',
    precio: 800,
    imagen: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
    disponible: true,
    categoria: 'Pizzas',
  },
  // Bebidas
  {
    id: '6',
    nombre: 'Agua Mineral',
    tipo: 'bebida',
    descripcion: 'Agua mineral sin gas 500ml',
    precio: 150,
    disponible: true,
  },
  {
    id: '7',
    nombre: 'Coca Cola',
    tipo: 'bebida',
    descripcion: 'Gaseosa cola 500ml',
    precio: 200,
    disponible: true,
  },
  {
    id: '8',
    nombre: 'Jugo de Naranja',
    tipo: 'bebida',
    descripcion: 'Jugo natural de naranja exprimida',
    precio: 250,
    disponible: true,
  },
  {
    id: '9',
    nombre: 'Café',
    tipo: 'bebida',
    descripcion: 'Café americano',
    precio: 180,
    disponible: true,
  },
  // Postres
  {
    id: '10',
    nombre: 'Flan Casero',
    tipo: 'postre',
    descripcion: 'Flan con dulce de leche y crema',
    precio: 350,
    imagen: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300',
    disponible: true,
  },
  {
    id: '11',
    nombre: 'Helado',
    tipo: 'postre',
    descripcion: 'Dos bochas de helado a elección',
    precio: 400,
    imagen: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300',
    disponible: true,
  },
  {
    id: '12',
    nombre: 'Tiramisu',
    tipo: 'postre',
    descripcion: 'Clásico postre italiano con café y mascarpone',
    precio: 450,
    imagen: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300',
    disponible: true,
  },
  {
    id: '13',
    nombre: 'Ensalada de Frutas',
    tipo: 'postre',
    descripcion: 'Frutas frescas de estación',
    precio: 320,
    imagen: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=300',
    disponible: true,
  },
];

export const usuarios: User[] = [
  { id: '1', nombre: 'Juan Pérez', email: 'cliente@test.com', rol: 'cliente' },
  { id: '2', nombre: 'Chef María', email: 'chef@test.com', rol: 'chef' },
  { id: '3', nombre: 'Cajero Pedro', email: 'cajero@test.com', rol: 'cajero' },
  { id: '4', nombre: 'Ana García', email: 'ana@test.com', rol: 'cliente' },
];

export const reservasIniciales: Reserva[] = [
  {
    id: 'R001',
    usuarioId: '1',
    sedeId: '1',
    turnoId: '2',
    fecha: '2025-10-10',
    estado: 'confirmada',
    items: [
      { consumibleId: '1', consumible: consumibles[0], cantidad: 1 },
      { consumibleId: '6', consumible: consumibles[5], cantidad: 1 },
      { consumibleId: '10', consumible: consumibles[9], cantidad: 1 },
    ],
    total: 1350,
    fechaCreacion: '2025-10-08T10:30:00',
  },
  {
    id: 'R002',
    usuarioId: '1',
    sedeId: '2',
    turnoId: '4',
    fecha: '2025-10-12',
    estado: 'pendiente',
    items: [
      { consumibleId: '3', consumible: consumibles[2], cantidad: 1 },
      { consumibleId: '8', consumible: consumibles[7], cantidad: 1 },
    ],
    total: 1150,
    fechaCreacion: '2025-10-08T14:20:00',
  },
];

export const menuDelDia = {
  fecha: '2025-10-08',
  turnoId: '2',
  platos: [consumibles[0], consumibles[2], consumibles[3]],
  bebidas: [consumibles[5], consumibles[6], consumibles[7]],
  postres: [consumibles[9], consumibles[10], consumibles[11]],
};

import type { Sede, Turno, Consumible, Reserva, User } from '../../types';


export const sedes: Sede[] = [
  {
    id: '1',
    nombre: 'Comedor Central',
    direccion: 'Avenida Principal 123',
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
    direccion: 'Avenida Sur 789',
    capacidad: 60,
    imagen: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  },
];

// Función helper para generar turnos para múltiples fechas y sedes
const generarTurnos = (): Turno[] => {
  const turnos: Turno[] = [];
  const sedeIds = ['1', '2', '3'];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Generar turnos para los próximos 14 días
  for (let dia = 1; dia <= 14; dia++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + dia);
    const fechaString = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

    sedeIds.forEach(sedeId => {
      // Desayuno
      turnos.push({
        id: `${sedeId}-1-${fechaString}`,
        nombre: 'Desayuno',
        horaInicio: '07:00',
        horaFin: '09:00',
        capacidad: 50,
        sedeId,
        fecha: fechaString,
        meal: 'desayuno',
        // Comedor Sur (id: '3') tiene desayuno agotado
        reservedCount: sedeId === '3' ? 50 : Math.floor(Math.random() * 30),
      });

      // Almuerzo
      turnos.push({
        id: `${sedeId}-2-${fechaString}`,
        nombre: 'Almuerzo',
        horaInicio: '12:00',
        horaFin: '14:30',
        capacidad: 100,
        sedeId,
        fecha: fechaString,
        meal: 'almuerzo',
        reservedCount: Math.floor(Math.random() * 60),
      });

      // Merienda
      turnos.push({
        id: `${sedeId}-3-${fechaString}`,
        nombre: 'Merienda',
        horaInicio: '16:00',
        horaFin: '18:00',
        capacidad: 40,
        sedeId,
        fecha: fechaString,
        meal: 'merienda',
        reservedCount: Math.floor(Math.random() * 25),
      });

      // Cena
      turnos.push({
        id: `${sedeId}-4-${fechaString}`,
        nombre: 'Cena',
        horaInicio: '20:00',
        horaFin: '22:00',
        capacidad: 80,
        sedeId,
        fecha: fechaString,
        meal: 'cena',
        reservedCount: Math.floor(Math.random() * 50),
      });
    });
  }

  return turnos;
};

export const turnos: Turno[] = generarTurnos();

export const consumibles: Consumible[] = [
  // Platos
  {
    id: '1',
    nombre: 'Milanesa con Pure',
    tipo: 'plato',
    descripcion: 'Milanesa de ternera con papas fritas',
    precio: 850,
    imagen: '/images/milanesa.png',
    disponible: true,
    categoria: 'Principal',
  },
  {
    id: '2',
    nombre: 'Ensalada César',
    tipo: 'plato',
    descripcion: 'Lechuga romana, pollo grillado, crutones y aderezo césar',
    precio: 750,
    imagen: '/images/ensalada.png',
    disponible: true,
    categoria: 'Ensaladas',
  },
 {
    id: '3',
    nombre: 'Pizza Margarita',
    tipo: 'plato',
    descripcion: 'Pizza con salsa de tomate, mozzarella y albahaca',
    precio: 800,
    imagen: '/images/pizza.png',
    disponible: true,
    categoria: 'Pizzas',
  },
   // Bebidas
  {
    id: '6',
    nombre: 'Agua Mineral',
    tipo: 'bebida',
    descripcion: 'Agua mineral sin gas 500ml',
    imagen: '/images/agua.png',
    precio: 150,
    disponible: true,
  },
  {
    id: '7',
    nombre: 'Gaseosas',
    tipo: 'bebida',
    descripcion: 'Gaseosa 500ml',
    imagen: '/images/gaseosas.png',
    precio: 200,
    disponible: true,
  },
  {
    id: '8',
    nombre: 'Jugo de Naranja',
    tipo: 'bebida',
    descripcion: 'Jugo natural de naranja exprimida',
    imagen: '/images/jugo.png',
    precio: 250,
    disponible: true,
  },

  // Postres
  {
    id: '10',
    nombre: 'Brownie con Helado',
    tipo: 'postre',
    descripcion: 'Delicioso brownie de chocolate con helado de vainilla',
    precio: 350,
    imagen: '/images/flan.png',
    disponible: true,
  },
  {
    id: '11',
    nombre: 'Panqueques con dulce de leche',
    tipo: 'postre',
    descripcion: 'Panqueques con dulce de leche',
    precio: 400,
    imagen: '/images/panqueque.png',
    disponible: true,
  },
  {
    id: '12',
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
    turnoId: '1-2-2025-10-25',
    fecha: '2025-10-25',
    estado: 'ACTIVA',
    items: [
      { consumibleId: '1', consumible: consumibles[0], cantidad: 1 },
      { consumibleId: '6', consumible: consumibles[5], cantidad: 1 },
      { consumibleId: '10', consumible: consumibles[9], cantidad: 1 },
    ],
    total: 1350,
    fechaCreacion: '2025-10-22T10:30:00',
  },
  {
    id: 'R002',
    usuarioId: '1',
    sedeId: '2',
    turnoId: '2-4-2025-10-26',
    fecha: '2025-10-26',
    estado: 'ACTIVA',
    items: [
      { consumibleId: '3', consumible: consumibles.find(c => c.id === '3')!, cantidad: 1 },
      { consumibleId: '8', consumible: consumibles.find(c => c.id === '8')!, cantidad: 1 },
    ],
    total: 1150,
    fechaCreacion: '2025-10-22T14:20:00',
  },
];

export const menuDelDia = {
  fecha: '2025-10-22',
  turnoId: '1-2-2025-10-22',
  platos: [consumibles[0], consumibles[2], consumibles[3]],
  bebidas: [consumibles[5], consumibles[6], consumibles[7]],
  postres: [consumibles[9], consumibles[10], consumibles[11]],
};

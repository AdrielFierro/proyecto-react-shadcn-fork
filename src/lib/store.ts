import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Reserva, TurnoHorario } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulación de login
        // En producción, esto haría una llamada a la API
        
        // Usuarios de prueba
        const usuarios: User[] = [
          { id: '1', nombre: 'Juan Pérez', email: 'cliente@test.com', rol: 'cliente' },
          { id: '2', nombre: 'Chef María', email: 'chef@test.com', rol: 'chef' },
          { id: '3', nombre: 'Cajero Pedro', email: 'cajero@test.com', rol: 'cajero' },
        ];

        const user = usuarios.find((u) => u.email === email);
        
        if (user && password === '123456') {
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface ReservaState {
  reservas: Reserva[];
  reservaActual: Reserva | null;
  slotOccupancy: Record<string, number>;
  setReservaActual: (reserva: Reserva | null) => void;
  agregarReserva: (reserva: Reserva) => void;
  actualizarReserva: (id: string, reserva: Partial<Reserva>) => void;
  obtenerReservaPorId: (id: string) => Reserva | undefined;
  cancelarReserva: (id: string) => void;
  getSlotCount: (slotId: string) => number;
  reservarHorario: (slot: TurnoHorario) => boolean;
  liberarHorario: (slot: TurnoHorario) => void;
}

export const useReservaStore = create<ReservaState>()(
  persist(
    (set, get) => ({
      reservas: [],
      reservaActual: null,
      slotOccupancy: {},
      
      setReservaActual: (reserva) => set({ reservaActual: reserva }),
      
      agregarReserva: (reserva) => {
        set((state) => {
          const nuevasReservas = [...state.reservas, reserva];
          const newOccupancy = { ...state.slotOccupancy };
          
          // Si tiene slotId, incrementar ocupación
          if (reserva.slotId) {
            const currentCount = newOccupancy[reserva.slotId] || 0;
            newOccupancy[reserva.slotId] = currentCount + 1;
          }
          
          return { 
            reservas: nuevasReservas,
            slotOccupancy: newOccupancy
          };
        });
      },
      
      actualizarReserva: (id, reservaUpdate) => {
        set((state) => ({
          reservas: state.reservas.map((r) =>
            r.id === id ? { ...r, ...reservaUpdate } : r
          ),
        }));
      },
      
      obtenerReservaPorId: (id) => {
        return get().reservas.find((r) => r.id === id);
      },
      
      cancelarReserva: (id) => {
        set((state) => {
          const reserva = state.reservas.find((r) => r.id === id);
          const newOccupancy = { ...state.slotOccupancy };
          
          // Si tiene slotId, liberar el horario
          if (reserva?.slotId) {
            const currentCount = newOccupancy[reserva.slotId] || 0;
            if (currentCount > 0) {
              newOccupancy[reserva.slotId] = currentCount - 1;
            }
          }
          
          return {
            reservas: state.reservas.map((r) =>
              r.id === id ? { ...r, estado: 'cancelada' as const } : r
            ),
            slotOccupancy: newOccupancy
          };
        });
      },
      
      getSlotCount: (slotId) => {
        return get().slotOccupancy[slotId] || 0;
      },
      
      reservarHorario: (slot) => {
        const currentCount = get().getSlotCount(slot.id);
        if (currentCount >= slot.capacity) {
          return false; // No hay cupo
        }
        
        set((state) => ({
          slotOccupancy: {
            ...state.slotOccupancy,
            [slot.id]: currentCount + 1,
          },
        }));
        
        return true;
      },
      
      liberarHorario: (slot) => {
        const currentCount = get().getSlotCount(slot.id);
        if (currentCount > 0) {
          set((state) => ({
            slotOccupancy: {
              ...state.slotOccupancy,
              [slot.id]: currentCount - 1,
            },
          }));
        }
      },
    }),
    {
      name: 'reserva-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Reserva } from '../types';

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
  setReservaActual: (reserva: Reserva | null) => void;
  agregarReserva: (reserva: Reserva) => void;
  actualizarReserva: (id: string, reserva: Partial<Reserva>) => void;
  obtenerReservaPorId: (id: string) => Reserva | undefined;
}

export const useReservaStore = create<ReservaState>()(
  persist(
    (set, get) => ({
      reservas: [],
      reservaActual: null,
      setReservaActual: (reserva) => set({ reservaActual: reserva }),
      agregarReserva: (reserva) => {
        set((state) => ({ reservas: [...state.reservas, reserva] }));
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
    }),
    {
      name: 'reserva-storage',
    }
  )
);

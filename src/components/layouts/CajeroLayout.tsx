import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../lib/store';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function CajeroLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-bold text-orange-600">Punto de Venta</h1>
              <Button variant="ghost" onClick={() => navigate('/cajero')}>
                Buscar Reserva
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span>{user?.nombre}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

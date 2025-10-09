import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Sede } from '../../types';

interface SedeCardProps {
  sede: Sede;
  isSelected: boolean;
  onSelect: (sede: Sede) => void;
}

export default function SedeCard({ sede, isSelected, onSelect }: SedeCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        isSelected && 'ring-2 ring-orange-500 shadow-lg'
      )}
      onClick={() => onSelect(sede)}
    >
      {sede.imagen && (
        <div className="h-48 overflow-hidden">
          <img
            src={sede.imagen}
            alt={sede.nombre}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSelected && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
          {sede.nombre}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {sede.direccion}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Capacidad: {sede.capacidad} personas</span>
        </div>
      </CardContent>
    </Card>
  );
}

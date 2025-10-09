import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock, Users } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Turno } from '../../types';

interface TurnoCardProps {
  turno: Turno;
  isSelected: boolean;
  onSelect: (turno: Turno) => void;
}

export default function TurnoCard({ turno, isSelected, onSelect }: TurnoCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-orange-500 shadow-lg bg-orange-50'
      )}
      onClick={() => onSelect(turno)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSelected && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
          <Clock className="w-5 h-5" />
          {turno.nombre}
        </CardTitle>
        <CardDescription className="text-lg font-semibold">
          {turno.horaInicio} - {turno.horaFin}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Capacidad: {turno.capacidad} personas</span>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Clock, Users, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Turno } from '../../types';

interface TurnoCardProps {
  turno: Turno;
  isSelected: boolean;
  onSelect: (turno: Turno) => void;
  horariosDisponibles?: string[];
  horaEspecifica?: string;
  onSelectHora?: (hora: string) => void;
}

export default function TurnoCard({ 
  turno, 
  isSelected, 
  onSelect,
  horariosDisponibles,
  horaEspecifica,
  onSelectHora
}: TurnoCardProps) {
  const sinCupo = turno.reservedCount >= turno.capacidad;

  const getMealLabel = (meal: string) => {
    const labels: Record<string, string> = {
      'desayuno': 'Desayuno',
      'almuerzo': 'Almuerzo',
      'merienda': 'Merienda',
      'cena': 'Cena'
    };
    return labels[meal] || meal;
  };

  return (
    <Card
      className={cn(
        'p-5 transition-all border-2',
        sinCupo
          ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-50'
          : isSelected
          ? 'border-[#1E3A5F] bg-blue-50 cursor-pointer'
          : 'border-gray-200 hover:border-[#1E3A5F] cursor-pointer hover:shadow-md'
      )}
      onClick={() => {
        if (!sinCupo) {
          onSelect(turno);
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            sinCupo 
              ? 'bg-gray-200' 
              : isSelected 
              ? 'bg-[#1E3A5F]' 
              : 'bg-[#8B6F47]'
          )}>
            <Clock className={cn('w-6 h-6', sinCupo ? 'text-gray-400' : 'text-white')} />
          </div>
          <div>
            <h3 className={cn('font-bold text-lg', sinCupo ? 'text-gray-400' : 'text-[#1E3A5F]')}>
              {turno.nombre}
            </h3>
            <p className={cn('text-sm', sinCupo ? 'text-gray-400' : 'text-gray-600')}>
              {getMealLabel(turno.meal)}
            </p>
          </div>
        </div>
        {isSelected && !sinCupo && (
          <Check className="w-6 h-6 text-[#1E3A5F]" />
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center gap-2">
          <Users className={cn('w-4 h-4', sinCupo ? 'text-gray-400' : 'text-gray-600')} />
          <span className={sinCupo ? 'text-gray-400' : 'text-gray-600'}>
            {turno.reservedCount} / {turno.capacidad}
          </span>
        </div>
        {sinCupo && (
          <Badge variant="destructive" className="bg-red-500">
            Sin cupo
          </Badge>
        )}
      </div>

      {isSelected && !sinCupo && horariosDisponibles && horariosDisponibles.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-semibold text-gray-700 mb-2">Selecciona un horario:</p>
          <div className="grid grid-cols-2 gap-2">
            {horariosDisponibles.map((hora) => (
              <button
                key={hora}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHora?.(hora);
                }}
                className={cn(
                  'px-3 py-2 rounded-md border-2 transition-all text-sm font-medium',
                  horaEspecifica === hora
                    ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                    : 'border-gray-300 hover:border-[#1E3A5F] bg-white text-gray-700'
                )}
              >
                {hora}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

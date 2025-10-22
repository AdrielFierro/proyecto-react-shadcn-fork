import type { TurnoHorario, Meal } from '../../types';

export const MEAL_WINDOWS: Record<Meal, { start: number; end: number }> = {
  Desayuno: { start: 7, end: 12 },   // 7-8, 8-9, 9-10, 10-11, 11-12
  Almuerzo: { start: 12, end: 16 },  // 12-13, 13-14, 14-15, 15-16
  Merienda: { start: 16, end: 20 },  // 16-17, 17-18, 18-19, 19-20
  Cena: { start: 20, end: 23 },      // 20-21, 21-22, 22-23
};

export function buildSlotsForMeal(params: {
  dateYmd: string;
  venueId: string;
  meal: Meal;
  venueCapacity: number;
}): TurnoHorario[] {
  const { dateYmd, venueId, meal, venueCapacity } = params;
  const { start, end } = MEAL_WINDOWS[meal];
  const out: TurnoHorario[] = [];
  
  for (let h = start; h < end; h++) {
    const s = String(h).padStart(2, '0') + ':00';
    const e = String(h + 1).padStart(2, '0') + ':00';
    out.push({
      id: `slot-${dateYmd}_${venueId}_${s}-${e}`,
      venueId,
      date: dateYmd,
      meal,
      start: s,
      end: e,
      capacity: venueCapacity,
      reservedCount: 0,
    });
  }
  
  return out;
}

export function getMealLabel(meal: Meal): string {
  return meal;
}

export function formatTimeSlot(start: string, end: string): string {
  return `${start} - ${end}`;
}
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function calculateExpiry(joinDate: Date, planDuration: number): Date {
  const d = new Date(joinDate);
  d.setMonth(d.getMonth() + planDuration);
  return d;
}

export function extendExpiry(currentExpiry: Date, planDuration: number): Date {
  const today = new Date();
  const base = currentExpiry > today ? new Date(currentExpiry) : new Date(today);
  base.setMonth(base.getMonth() + planDuration);
  return base;
}

export function classifyExpiry(expiryDate: Date): 'active' | 'expiring_soon' | 'expired' {
  const today = startOfDay(new Date());
  const expiry = startOfDay(expiryDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilExpiry = Math.round((expiry.getTime() - today.getTime()) / msPerDay);

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 7) return 'expiring_soon';
  return 'active';
}

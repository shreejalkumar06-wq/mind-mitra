export function toDateOnly(input = new Date()) {
  const date = input instanceof Date ? input : new Date(input);
  return date.toISOString().slice(0, 10);
}

export function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateOnly(date);
}

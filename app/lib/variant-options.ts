/** A variant stores its fuels / transmissions as one comma-separated string, e.g. "Petrol, CNG". */
export function splitOptions(value?: string): string[] {
  return (value ?? "")
    .split(/[,/]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export function joinOptions(values: string[], order: string[] = []): string {
  const rank = (v: string) => (order.includes(v) ? order.indexOf(v) : order.length);
  return [...values].sort((a, b) => rank(a) - rank(b)).join(", ");
}

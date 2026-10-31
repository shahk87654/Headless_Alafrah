export function formatPrice(amount: string | number, currency = "AED") {
  const value = typeof amount === "number" ? amount : Number(amount);
  return `${currency} ${new Intl.NumberFormat("en-AE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)}`;
}

export function savePercent(price: string | number, compareAt: string | number) {
  const current = typeof price === "number" ? price : Number(price);
  const original = typeof compareAt === "number" ? compareAt : Number(compareAt);
  if (!original || original <= current) return null;
  return Math.round(((original - current) / original) * 100);
}

export function formatDimensions(values: Array<string | number>, unit: "in" | "cm") {
  return `${values.map((value) => String(value).trim()).join(" × ")} ${unit}`;
}

function luminance(hex: string) {
  const raw = hex.replace("#", "");
  const value = raw.length === 3 ? raw.split("").map((char) => char + char).join("") : raw;
  const rgb = [0, 2, 4].map((index) => {
    const channel = Number.parseInt(value.slice(index, index + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrastRatio(a: string, b: string) {
  const left = luminance(a);
  const right = luminance(b);
  const lighter = Math.max(left, right);
  const darker = Math.min(left, right);
  return (lighter + 0.05) / (darker + 0.05);
}

export const MARQUINA = "#16181B";
export const CALACATTA = "#F1F2EF";

/** AA for normal text is 4.5:1. Prefer Marquina on light stones, Calacatta on dark. */
export function inkOn(background: string) {
  const marquina = contrastRatio(background, MARQUINA);
  const calacatta = contrastRatio(background, CALACATTA);
  if (marquina >= 4.5 && marquina >= calacatta) return MARQUINA;
  if (calacatta >= 4.5) return CALACATTA;
  return marquina >= calacatta ? MARQUINA : CALACATTA;
}

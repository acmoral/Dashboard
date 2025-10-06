export function blueScale(t: number) {
  // clamp t between 0–1
  t = Math.min(1, Math.max(0, t));

  // start = #00a8e8 (rgba(213, 244, 255, 1))
  const r1 = 213, g1 = 244, b1 = 255;
  // end   = #003459 (rgb(0, 52, 89))
  const r2 = 0, g2 = 52, b2 = 89;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}
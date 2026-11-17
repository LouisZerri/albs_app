// Types pour tokens.js (source unique consommée aussi par tailwind.config.js).
export type Palette = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  hair: string;
  accent: string;
  accentSoft: string;
  visited: string;
  visitedSoft: string;
  passed: string;
  goldSoft: string;
  todo: string;
  danger: string;
  mapLand: string;
  mapCity: string;
  mapWater: string;
  white: string;
};
export const palettes: { light: Palette; dark: Palette };
export const radius: { sm: number; md: number; card: number; pill: number };
export function cssVariables(palette: Palette): Record<string, string>;

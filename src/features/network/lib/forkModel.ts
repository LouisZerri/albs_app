import type { Station } from '../types';

export type Branch = { key: string; label: string };

const FORK = 'fork';

/** La ligne a-t-elle une fourche ? */
export function hasFork(stations: Station[]): boolean {
  return stations.some((s) => s.branch === FORK);
}

/** Branches de la ligne (hors tronc et fourche), avec label = terminus de la branche. */
export function getBranches(stations: Station[]): Branch[] {
  if (!hasFork(stations)) return []; // pas de fourche → pas de branches (évite de confondre avec une boucle)

  const forkPos = stations.find((s) => s.branch === FORK)?.position ?? 0;
  const keys = [
    ...new Set(stations.map((s) => s.branch).filter((b): b is string => b !== null && b !== FORK)),
  ];

  return keys.map((key) => {
    const inBranch = stations.filter((s) => s.branch === key);
    // Terminus = station la plus éloignée du point de fourche.
    const terminus = inBranch.reduce((far, s) =>
      Math.abs(s.position - forkPos) > Math.abs(far.position - forkPos) ? s : far,
    );
    return { key, label: terminus.name };
  });
}

/** Stations à afficher : tronc + fourche + branche sélectionnée (ordre d'origine de l'API). */
export function displayStations(stations: Station[], selectedBranch: string | null): Station[] {
  return stations.filter(
    (s) => s.branch === null || s.branch === FORK || s.branch === selectedBranch,
  );
}

/** Vrai pour la station qui porte le sélecteur de branche. */
export function isForkStation(station: Station): boolean {
  return station.branch === FORK;
}

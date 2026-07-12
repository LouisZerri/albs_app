import type { Ionicons } from '@expo/vector-icons';

export type OnboardingStep = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  /** Dernier écran : porte l'engagement fair-play. */
  commit?: boolean;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    icon: 'train',
    title: 'Bienvenue à bord',
    body: 'À la bonne station transforme tes trajets en aventure : coche les stations où tu es descendu, gagne des badges et pars à la conquête de tout le réseau.',
  },
  {
    icon: 'map',
    title: 'Le principe',
    body: 'Chaque station compte. Suis ta progression ligne par ligne, débloque des badges et vise les 100 % du réseau parisien.',
  },
  {
    icon: 'shield-checkmark',
    title: 'Fair-play',
    body: 'Ici, tout repose sur l’honnêteté : pas de géolocalisation, pas de triche. Tu coches uniquement les stations où tu es vraiment passé, et tu respectes les autres joueurs et l’esprit du jeu.',
    commit: true,
  },
];

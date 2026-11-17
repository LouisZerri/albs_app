import type { Ionicons } from '@expo/vector-icons';

export type OnboardingStep = {
  /** Clé des textes de l'étape (`onboarding:steps.<key>.title` / `.body`). */
  key: 'welcome' | 'principle' | 'fairPlay';
  icon: keyof typeof Ionicons.glyphMap;
  /** Dernier écran : porte l'engagement fair-play. */
  commit?: boolean;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { key: 'welcome', icon: 'train' },
  { key: 'principle', icon: 'map' },
  { key: 'fairPlay', icon: 'shield-checkmark', commit: true },
];

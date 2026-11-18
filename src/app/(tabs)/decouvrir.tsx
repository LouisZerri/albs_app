import { DiscoverHome } from '@/features/discover/components';
import { useLanguage } from '@/i18n';

export default function DecouvrirTab() {
  // La clé remonte l'écran quand la langue change : tous ses textes sont recalculés tout de suite,
  // y compris ceux mémorisés (rang, dates, libellés calculés hors des composants).
  const { language } = useLanguage();

  return <DiscoverHome key={language} />;
}

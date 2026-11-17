import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { useLanguage, useTranslation } from '@/i18n';
import { Button, Chip, Input, Text } from '@/shared/ui';

import { allCategories } from '../lib/categories';
import type { LatLng } from '../lib/distance';
import { createBonplanInputSchema, type BonplanInput } from '../types';
import { LocationPicker } from './LocationPicker';

type FieldErrors = Partial<Record<'title' | 'category' | 'address' | 'description', string>>;

type Props = {
  onSubmit: (input: BonplanInput) => void;
  loading: boolean;
  /** Position de la station : centre de la carte de choix d'emplacement (absente = pas de carte). */
  stationPoint: LatLng | null;
  /** Erreur renvoyée par l'API, affichée au-dessus du bouton. */
  apiError: string | null;
};

/** Formulaire « Proposer un bon plan » : nom, catégorie, adresse, description. Validé avec Zod. */
export function BonplanForm({ onSubmit, loading, stationPoint, apiError }: Props) {
  const { t } = useTranslation('bonplans');
  const { language } = useLanguage();
  // Reconstruit au changement de langue : les messages de validation suivent la langue active.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schema = useMemo(() => createBonplanInputSchema(), [language]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LatLng | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = () => {
    const parsed = schema.safeParse({
      title,
      category,
      address,
      description,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
    });
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      setErrors({
        title: fields.title?.[0],
        category: fields.category?.[0],
        address: fields.address?.[0],
        description: fields.description?.[0],
      });
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <View className="gap-5">
      <Input
        label={t('form.nameLabel')}
        value={title}
        onChangeText={setTitle}
        error={errors.title}
        placeholder={t('form.namePlaceholder')}
        maxLength={150}
        returnKeyType="next"
      />

      <View className="gap-1.5">
        <Text variant="label">{t('form.categoryLabel')}</Text>
        <View className="flex-row flex-wrap gap-2">
          {allCategories().map((c) => (
            <Chip
              key={c.key}
              label={`${c.icon} ${c.label}`}
              active={c.key === category}
              onPress={() => setCategory(c.key)}
            />
          ))}
        </View>
        {errors.category ? (
          <Text variant="muted" color="danger">
            {errors.category}
          </Text>
        ) : null}
      </View>

      <Input
        label={t('form.addressLabel')}
        value={address}
        onChangeText={setAddress}
        error={errors.address}
        placeholder={t('form.addressPlaceholder')}
        maxLength={255}
        autoComplete="street-address"
        returnKeyType="next"
      />

      {stationPoint ? (
        <LocationPicker center={stationPoint} value={location} onChange={setLocation} />
      ) : null}

      <Input
        label={t('form.descriptionLabel')}
        value={description}
        onChangeText={setDescription}
        error={errors.description}
        placeholder={t('form.descriptionPlaceholder')}
        maxLength={1000}
        multiline
        // Champ multiligne : hauteur confortable, texte aligné en haut.
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />

      {apiError ? (
        <Text variant="muted" color="danger" className="text-center">
          {apiError}
        </Text>
      ) : null}

      <Button label={t('form.submit')} onPress={submit} loading={loading} />
    </View>
  );
}

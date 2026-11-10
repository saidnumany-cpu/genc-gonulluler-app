import { useState } from 'react';
import { View } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { createProfile, updateSkills } from '@/lib/data';
import { CATEGORIES, SKILL_TAGS } from '@/lib/types';
import { Button, Chip, Screen, Squiggle, T } from '@/components/ui';
import { colors } from '@/theme';

export default function Yetenekler() {
  const { user, profile } = useAuth();
  const [picked, setPicked] = useState<string[]>(profile?.skills ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const toggle = (tag: string) => setPicked((p) => (p.includes(tag) ? p.filter((x) => x !== tag) : [...p, tag]));

  async function save() {
    if (!user) return;
    setBusy(true);
    setError('');
    try {
      if (!profile) await createProfile(user.uid, user.displayName || 'Gönüllü');
      await updateSkills(user.uid, picked);
    } catch {
      setError('Kaydedilemedi. İnternet bağlantını kontrol edip tekrar dene.');
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={{ gap: 8, paddingTop: 20 }}>
        <T w="semibold" size={13} color={colors.redDark}>
          Son adım
        </T>
        <T w="extrabold" size={28} style={{ letterSpacing: -0.8, lineHeight: 34 }}>
          Neyde iyisin?
        </T>
        <Squiggle />
        <T size={15} color={colors.muted} style={{ lineHeight: 22 }}>
          Dijitalden sahaya, bildiğin her şey birine iyi gelir. Seçtiğin yeteneklere göre sana uygun görevleri eşleştireceğiz; sonradan profilinden değiştirebilirsin.
        </T>
      </View>

      {CATEGORIES.map((c) => (
        <View key={c.id} style={{ gap: 10 }}>
          <T w="extrabold" size={15}>
            {c.label}
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SKILL_TAGS.filter((s) => s.category === c.id).map((s) => (
              <Chip key={s.tag} label={s.tag} active={picked.includes(s.tag)} onPress={() => toggle(s.tag)} dashed />
            ))}
          </View>
        </View>
      ))}

      {error ? (
        <T w="semibold" size={13} color={colors.redDark}>
          {error}
        </T>
      ) : null}
      <Button label={picked.length ? `${picked.length} yetenekle başla` : 'En az bir yetenek seç'} icon="arrow" disabled={!picked.length} loading={busy} onPress={save} />
      <Button label="Çıkış yap" variant="ghost" onPress={() => signOut(auth)} />
    </Screen>
  );
}

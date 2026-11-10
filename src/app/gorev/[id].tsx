import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { useAppData } from '@/lib/app-data';
import { claimTask, submitTask, unclaimTask } from '@/lib/data';
import { formatNumber } from '@/lib/impact';
import { categoryLabel } from '@/lib/types';
import { Icon } from '@/components/Icon';
import { Button, Card, Empty, Field, Pill, T } from '@/components/ui';
import { colors, radius } from '@/theme';

const initials = (s: string) =>
  s
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toLocaleUpperCase('tr-TR'))
    .join('');

const isUrl = (s: string) => /^https?:\/\/\S+\.\S+/.test(s.trim());

export default function GorevDetay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { tasks, claimByTask, isMatch } = useAppData();
  const task = tasks.find((t) => t.id === id);
  const claim = id ? claimByTask[id] : undefined;
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const back = () => (router.canGoBack() ? router.back() : router.replace('/gorevler'));

  if (!task || !profile) {
    return (
      <View style={{ flex: 1, padding: 20, paddingTop: insets.top + 20, gap: 16, backgroundColor: colors.bg }}>
        <Empty text="Görev bulunamadı ya da kaldırılmış." />
        <Button label="Görevlere dön" variant="outline" onPress={back} />
      </View>
    );
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch {
      setError('İşlem tamamlanamadı. Bağlantını kontrol edip tekrar dene.');
    } finally {
      setBusy(false);
    }
  }

  const status = claim?.status;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            backgroundColor: colors.red,
            paddingTop: insets.top + 12,
            paddingHorizontal: 20,
            paddingBottom: 28,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            gap: 14,
            overflow: 'hidden',
          }}
        >
          <View style={{ position: 'absolute', right: -90, bottom: -110, width: 260, height: 260, borderRadius: 130, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Pressable
            onPress={back}
            accessibilityRole="button"
            accessibilityLabel="Geri"
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="back" size={20} color={colors.white} strokeWidth={2.2} />
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pill label={categoryLabel(task.category)} tone="white" />
            {isMatch(task) ? <Pill label="Yeteneğine uygun" tone="glass" /> : null}
          </View>
          <T w="extrabold" size={25} color={colors.white} style={{ letterSpacing: -0.7, lineHeight: 31 }} accessibilityRole="header">
            {task.title}
          </T>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <T w="extrabold" size={14} color={colors.red}>
                {initials(task.org)}
              </T>
            </View>
            <View style={{ flex: 1 }}>
              <T w="bold" size={14} color={colors.white}>
                {task.org}
              </T>
              <T size={12} color={colors.white} style={{ opacity: 0.9 }}>
                {task.city} · {task.cause}
              </T>
            </View>
          </View>
        </View>

        <View style={{ padding: 20, gap: 16, width: '100%', maxWidth: 560, alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              ['Süre', `${task.minutes} dk`],
              ['Yer', 'Uzaktan'],
              ['Ulaşacak', `${formatNumber(task.impactCount)} kişi`],
            ].map(([label, value]) => (
              <View key={label} style={{ flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, gap: 2 }}>
                <T w="semibold" size={11} color={colors.muted}>
                  {label}
                </T>
                <T w="extrabold" size={15}>
                  {value}
                </T>
              </View>
            ))}
          </View>

          <Card dark>
            <T w="bold" size={12} color={colors.redOnDark} style={{ letterSpacing: 0.8 }}>
              YARATACAĞIN ETKİ
            </T>
            <T w="bold" size={17} color={colors.white} style={{ lineHeight: 24 }}>
              {task.impactText}.
            </T>
          </Card>

          <View style={{ gap: 10 }}>
            <T w="extrabold" size={16} accessibilityRole="header">
              Ne yapacaksın?
            </T>
            {task.steps.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <T w="extrabold" size={13} color={colors.redDark}>
                    {i + 1}
                  </T>
                </View>
                <T size={14} color={colors.text} style={{ flex: 1, lineHeight: 20 }}>
                  {s}
                </T>
              </View>
            ))}
          </View>

          {status === 'claimed' || status === 'rejected' ? (
            <Card>
              <T w="extrabold" size={16}>
                Teslim et
              </T>
              <T size={13} color={colors.muted} style={{ lineHeight: 19 }}>
                Çalışmanı Google Drive, Figma, GitHub ya da benzeri bir yere yükleyip paylaşım bağlantısını buraya yapıştır. Kurum onaylayınca etkin profiline işlenir.
              </T>
              <Field label="Bağlantı" value={link} onChangeText={setLink} placeholder="https://" autoCapitalize="none" keyboardType="url" />
              <Button
                label="Teslim et"
                icon="check"
                disabled={!isUrl(link)}
                loading={busy}
                onPress={() => run(() => submitTask(profile.uid, task.id, link.trim()))}
              />
            </Card>
          ) : null}

          {status === 'submitted' ? (
            <Card>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Icon name="clock" size={20} color={colors.red} strokeWidth={2} />
                <T w="extrabold" size={16}>
                  Kurum onayı bekleniyor
                </T>
              </View>
              <T size={13} color={colors.muted} style={{ lineHeight: 19 }}>
                Teslimin {task.org} ekibine iletildi. Onaylandığında etki hikâyen “Etkim” sekmesinde görünecek.
              </T>
            </Card>
          ) : null}

          {status === 'approved' ? (
            <Card style={{ backgroundColor: colors.redSoft, borderColor: colors.redSoft }}>
              <T w="extrabold" size={16} color={colors.redDark}>
                Tamamlandı · {formatNumber(claim?.impact ?? 0)} kişiye ulaştı
              </T>
              {claim?.story ? (
                <T size={14} color="#4A0A12" style={{ lineHeight: 20 }}>
                  {claim.story}
                </T>
              ) : null}
            </Card>
          ) : null}

          {error ? (
            <T w="semibold" size={13} color={colors.redDark} accessibilityLiveRegion="polite">
              {error}
            </T>
          ) : null}
        </View>
      </ScrollView>

      {!status || status === 'claimed' ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 14, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border }}>
          {!status ? (
            <Button label="Görevi üstlen" icon="arrow" loading={busy} onPress={() => run(() => claimTask(profile, task))} />
          ) : (
            <Button label="Vazgeç" variant="outline" loading={busy} onPress={() => run(() => unclaimTask(profile.uid, task.id))} />
          )}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

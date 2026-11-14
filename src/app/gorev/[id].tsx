import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth-context';
import { useAppData } from '@/lib/app-data';
import { claimTask, submitTask, unclaimTask } from '@/lib/data';
import { formatNumber } from '@/lib/impact';
import { categoryLabel } from '@/lib/types';
import { Glass, useLiquidGlass } from '@/components/Glass';
import { Icon } from '@/components/Icon';
import { Button, Card, Empty, Field, Pill, T } from '@/components/ui';
import { useLayout } from '@/lib/use-layout';
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
  const { isDesktop } = useLayout();
  const glass = useLiquidGlass();
  const contentWidth = isDesktop ? 760 : 560;
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
  const onSite = task.mode === 'yerinde';
  const duration = task.minutes >= 120 ? `${Math.round(task.minutes / 60)} sa` : `${task.minutes} dk`;
  const canSubmit = onSite ? link.trim().length >= 3 : isUrl(link);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: glass ? insets.bottom + 110 : 24 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            backgroundColor: colors.red,
            paddingTop: insets.top + (isDesktop ? 28 : 12),
            paddingHorizontal: isDesktop ? 40 : 20,
            paddingBottom: isDesktop ? 40 : 28,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            gap: 14,
            overflow: 'hidden',
          }}
        >
          <View style={{ position: 'absolute', right: -90, bottom: -110, width: 260, height: 260, borderRadius: 130, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <View style={{ gap: 14, width: '100%', maxWidth: contentWidth, alignSelf: 'center' }}>
          <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Geri" style={{ alignSelf: 'flex-start' }}>
            <Glass
              variant="clear"
              colorScheme="dark"
              interactive
              fallbackColor="rgba(255,255,255,0.18)"
              style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="back" size={20} color={colors.white} strokeWidth={2.2} />
            </Glass>
          </Pressable>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pill label={categoryLabel(task.category)} tone="white" />
            {isMatch(task) ? <Pill label="Yeteneğine uygun" tone="glass" /> : null}
          </View>
          <T w="extrabold" size={isDesktop ? 32 : 25} color={colors.white} style={{ letterSpacing: -0.7, lineHeight: isDesktop ? 38 : 31 }} accessibilityRole="header">
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
        </View>

        <View style={{ padding: 20, paddingTop: isDesktop ? 28 : 20, gap: 16, width: '100%', maxWidth: contentWidth + 40, alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              ['Süre', duration],
              ['Yer', onSite ? task.city : 'Uzaktan'],
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

          {onSite && (task.place || task.when) ? (
            <Card style={{ gap: 8 }}>
              {task.when ? (
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <Icon name="clock" size={18} color={colors.red} strokeWidth={2} />
                  <T w="bold" size={14} style={{ flex: 1 }}>
                    {task.when}
                  </T>
                </View>
              ) : null}
              {task.place ? (
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <Icon name="pin" size={18} color={colors.red} strokeWidth={2} />
                  <T w="bold" size={14} style={{ flex: 1 }}>
                    {task.place}
                  </T>
                </View>
              ) : null}
            </Card>
          ) : null}

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
                {onSite ? 'Katılımını bildir' : 'Teslim et'}
              </T>
              <T size={13} color={colors.muted} style={{ lineHeight: 19 }}>
                {onSite
                  ? 'Göreve katıldıktan sonra kısa bir not yaz (örn. "3 saat dağıtımdaydım, 40 koli hazırladık"). Kurum katılımını onaylayınca etkin profiline işlenir.'
                  : 'Çalışmanı Google Drive, Figma, GitHub ya da benzeri bir yere yükleyip paylaşım bağlantısını buraya yapıştır. Kurum onaylayınca etkin profiline işlenir.'}
              </T>
              {onSite ? (
                <Field label="Katılım notu" value={link} onChangeText={setLink} placeholder="Ne yaptın?" multiline maxLength={400} style={{ minHeight: 80, textAlignVertical: 'top' }} />
              ) : (
                <Field label="Bağlantı" value={link} onChangeText={setLink} placeholder="https://" autoCapitalize="none" keyboardType="url" />
              )}
              <Button
                label={onSite ? 'Katıldım' : 'Teslim et'}
                icon="check"
                disabled={!canSubmit}
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
        <Glass
          fallbackColor={colors.white}
          style={
            glass
              ? { position: 'absolute', left: 14, right: 14, bottom: insets.bottom + 6, padding: 8, borderRadius: 36 }
              : { paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 14, borderTopWidth: 1, borderTopColor: colors.border }
          }
        >
          <View style={{ width: '100%', maxWidth: contentWidth, alignSelf: 'center', alignItems: isDesktop ? 'flex-end' : 'stretch' }}>
            {!status ? (
              <Button label="Görevi üstlen" icon="arrow" loading={busy} onPress={() => run(() => claimTask(profile, task))} style={isDesktop ? { minWidth: 260 } : undefined} />
            ) : (
              <Button label="Vazgeç" variant="outline" loading={busy} onPress={() => run(() => unclaimTask(profile.uid, task.id))} style={isDesktop ? { minWidth: 260 } : undefined} />
            )}
          </View>
        </Glass>
      ) : null}
    </KeyboardAvoidingView>
  );
}

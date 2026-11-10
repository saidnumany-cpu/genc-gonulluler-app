import { useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import { useAppData } from '@/lib/app-data';
import { formatNumber, startOfMonth, summarize } from '@/lib/impact';
import { Button, Card, Empty, Screen, T } from '@/components/ui';
import { colors, radius } from '@/theme';

const DOTS = 60;
const barColors = [colors.red, colors.redDark, colors.ink, colors.muted, '#8A8A90', '#B8B5B2'];

const ago = (ms: number) => {
  const d = Math.floor((Date.now() - ms) / 86400000);
  if (d <= 0) return 'bugün';
  if (d < 7) return `${d} gün önce`;
  if (d < 30) return `${Math.floor(d / 7)} hafta önce`;
  return `${Math.floor(d / 30)} ay önce`;
};

export default function Etki() {
  const { claims } = useAppData();
  const [period, setPeriod] = useState<'month' | 'all'>('all');
  const s = summarize(claims, period === 'month' ? startOfMonth() : undefined);

  // Her nokta kaç kişiyi temsil etsin: 60 noktaya sığacak en küçük "yuvarlak" sayı.
  const perDot = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000].find((n) => s.people / n <= DOTS) ?? 1000;
  const filled = Math.min(DOTS, Math.round(s.people / perDot));
  const max = s.byCause[0]?.value ?? 1;

  async function share() {
    try {
      await Share.share({
        message: `Genç Gönüllüler'de yeteneğimle ${s.tasks} mikro görev tamamladım ve ${formatNumber(s.people)} kişinin hayatına dokundum. Sen de katıl!`,
      });
    } catch {}
  }

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <T w="semibold" size={13} color={colors.redDark}>
          Etkim
        </T>
        <T w="extrabold" size={26} style={{ letterSpacing: -0.8, lineHeight: 32 }} accessibilityRole="header">
          Puan değil,{'\n'}insan sayıyoruz.
        </T>
      </View>

      <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 4, backgroundColor: '#EDEBE8', borderRadius: radius.pill, padding: 4 }}>
        {(
          [
            ['month', 'Bu ay'],
            ['all', 'Tüm zamanlar'],
          ] as const
        ).map(([id, label]) => {
          const on = period === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => setPeriod(id)}
              style={{ flex: 1, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.white : 'transparent' }}
            >
              <T w="bold" size={14} color={on ? colors.ink : colors.muted}>
                {label}
              </T>
            </Pressable>
          );
        })}
      </View>

      <Card dark style={{ borderRadius: 26, padding: 22, gap: 16 }}>
        <View>
          <T w="extrabold" size={48} color={colors.white} style={{ letterSpacing: -2, lineHeight: 52 }}>
            {formatNumber(s.people)}
          </T>
          <T w="semibold" size={14} color="#D4D4D8">
            hayata dokundun
          </T>
        </View>
        <View
          accessible
          accessibilityLabel={`${formatNumber(s.people)} kişiye ulaşan etki, noktalarla gösterim`}
          style={{ gap: 6 }}
        >
          {[0, 1, 2, 3].map((row) => (
            <View key={row} style={{ flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: DOTS / 4 }, (_, col) => {
                const i = row * (DOTS / 4) + col;
                return <View key={col} style={{ flex: 1, aspectRatio: 1, borderRadius: 99, backgroundColor: i < filled ? '#FF4D5E' : '#2E2E35' }} />;
              })}
            </View>
          ))}
        </View>
        <T size={12} color="#A1A1AA">
          Her nokta ≈ {perDot} kişi · Kurum onaylı veriler
        </T>
      </Card>

      {s.byCause.length ? (
        <Card>
          <T w="extrabold" size={16}>
            Etkinin dağılımı
          </T>
          {s.byCause.map((c, i) => (
            <View key={c.name} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T w="semibold" size={13} color={colors.text}>
                  {c.name}
                </T>
                <T w="extrabold" size={13}>
                  {formatNumber(c.value)} kişi
                </T>
              </View>
              <View style={{ height: 8, borderRadius: 8, backgroundColor: colors.redTrack, overflow: 'hidden' }}>
                <View style={{ height: 8, borderRadius: 8, width: `${Math.round((c.value / max) * 100)}%`, backgroundColor: barColors[i % barColors.length] }} />
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      <View style={{ gap: 10 }}>
        <T w="extrabold" size={16} accessibilityRole="header">
          Etki hikâyelerin
        </T>
        {s.stories.length ? (
          s.stories.map((c) => (
            <View key={c.id} style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16 }}>
              <View style={{ minWidth: 44, height: 44, paddingHorizontal: 6, borderRadius: 14, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
                <T w="extrabold" size={15} color={colors.redDark}>
                  {formatNumber(c.impact ?? 0)}
                </T>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <T w="bold" size={14} style={{ lineHeight: 20 }}>
                  {c.story || c.taskTitle}
                </T>
                <T size={12} color={colors.muted}>
                  {c.org}
                  {c.approvedAt ? ` · ${ago(c.approvedAt.toMillis())}` : ''}
                </T>
              </View>
            </View>
          ))
        ) : (
          <Empty
            text={
              period === 'month'
                ? 'Bu ay henüz onaylanmış bir görevin yok.'
                : 'Görevlerin kurum tarafından onaylandıkça, dokunduğun hayatların hikâyeleri burada birikecek.'
            }
          />
        )}
      </View>

      {s.tasks ? <Button label="Etkimi paylaş" icon="share" onPress={share} /> : null}
    </Screen>
  );
}

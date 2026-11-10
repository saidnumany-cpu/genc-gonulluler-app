import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { useAppData } from '@/lib/app-data';
import { computeBadges, formatNumber, summarize } from '@/lib/impact';
import { CATEGORIES } from '@/lib/types';
import { Icon, categoryIcon } from '@/components/Icon';
import { TaskCard } from '@/components/TaskCard';
import { Avatar, Card, Empty, HexBadge, Pill, Ring, Screen, SectionHeader, Squiggle, T } from '@/components/ui';
import { colors, radius } from '@/theme';

export default function AnaSayfa() {
  const { profile } = useAuth();
  const { tasks, tasksLoading, claims, claimByTask, myCategories, isMatch } = useAppData();
  const summary = summarize(claims);
  const badges = computeBadges(claims);
  const firstName = (profile?.name ?? '').split(' ')[0];

  const open = tasks.filter((t) => !claimByTask[t.id]);
  const featured = open.find(isMatch) ?? open[0];
  const inProgress = tasks.filter((t) => ['claimed', 'submitted', 'rejected'].includes(claimByTask[t.id]?.status ?? ''));
  const myCats = CATEGORIES.filter((c) => myCategories.includes(c.id));
  const nextMilestone = [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000].find((m) => m > summary.people) ?? summary.people;
  const latest = summary.stories[0];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Avatar name={profile?.name ?? '?'} />
          <View>
            <T size={13} color={colors.muted}>
              Merhaba,
            </T>
            <T w="extrabold" size={20} style={{ letterSpacing: -0.4 }}>
              {firstName}
            </T>
          </View>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <T w="extrabold" size={26} style={{ letterSpacing: -0.8, lineHeight: 32 }} accessibilityRole="header">
          Bugün yeteneğinle{'\n'}bir hayata dokun.
        </T>
        <Squiggle />
      </View>

      {featured ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Senin için eşleştirdik: ${featured.title}`}
          onPress={() => router.push({ pathname: '/gorev/[id]', params: { id: featured.id } })}
          style={({ pressed }) => ({
            backgroundColor: colors.red,
            borderRadius: 24,
            padding: 22,
            gap: 10,
            overflow: 'hidden',
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <View style={{ position: 'absolute', right: -70, top: -60, width: 220, height: 220, borderRadius: 110, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <View style={{ position: 'absolute', right: -40, top: -30, width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Pill label={isMatch(featured) ? 'Senin için eşleştirdik' : 'Yeni görev'} tone="glass" />
          <T w="extrabold" size={21} color={colors.white} style={{ lineHeight: 26, maxWidth: 280 }}>
            {featured.title}
          </T>
          <T size={13} color={colors.white} style={{ opacity: 0.92, lineHeight: 19, maxWidth: 270 }}>
            {featured.impactText}.
          </T>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <Icon name="clock" size={15} color={colors.white} strokeWidth={2} />
              <T w="semibold" size={13} color={colors.white}>
                {featured.minutes} dk · {featured.org}
              </T>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="arrow" size={20} color={colors.red} strokeWidth={2.2} />
            </View>
          </View>
        </Pressable>
      ) : (
        <Empty text={tasksLoading ? 'Görevler yükleniyor…' : 'Şu an açık görev yok. Yeni görevler eklendiğinde burada göreceksin.'} />
      )}

      {inProgress.length ? (
        <View style={{ gap: 12 }}>
          <SectionHeader title="Devam eden görevlerin" />
          {inProgress.map((t) => (
            <TaskCard key={t.id} task={t} matched={isMatch(t)} status={claimByTask[t.id]?.status} />
          ))}
        </View>
      ) : null}

      <View style={{ gap: 12 }}>
        <SectionHeader title="Yetenek eşleşmelerin" action="Tümünü gör" onAction={() => router.push('/gorevler')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 20 }} style={{ marginRight: -20 }}>
          {myCats.map((c) => {
            const count = open.filter((t) => t.category === c.id).length;
            return (
              <Pressable
                key={c.id}
                accessibilityRole="link"
                onPress={() => router.push({ pathname: '/gorevler', params: { kategori: c.id } })}
                style={{ width: 140, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 16, gap: 10 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.redSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={categoryIcon[c.id]} size={18} color={colors.red} strokeWidth={2} />
                </View>
                <T w="bold" size={14} style={{ minHeight: 36, lineHeight: 18 }}>
                  {c.label}
                </T>
                <T size={12} color={colors.muted}>
                  {count} açık görev
                </T>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Pressable accessibilityRole="link" onPress={() => router.push('/etki')}>
        <Card style={{ borderRadius: 24, padding: 20, gap: 16 }}>
          <SectionHeader title="Etki takibi" />
          <View style={{ flexDirection: 'row', gap: 18, alignItems: 'center' }}>
            <Ring value={formatNumber(summary.people)} label={'dokunulan\nhayat'} progress={nextMilestone ? summary.people / nextMilestone : 0} />
            <View style={{ flex: 1, gap: 10 }}>
              {[
                ['Tamamlanan görev', summary.tasks],
                ['Desteklenen kurum', summary.orgs],
                ['Sıradaki hedef', `${formatNumber(nextMilestone)} kişi`],
              ].map(([label, value]) => (
                <View key={String(label)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 8 }}>
                  <T w="medium" size={12} color={colors.muted}>
                    {label}
                  </T>
                  <T w="extrabold" size={15}>
                    {String(value)}
                  </T>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, backgroundColor: colors.redSoft, borderRadius: radius.md, padding: 14 }}>
            <Icon name="heart" size={18} color={colors.red} filled />
            <T size={13} color="#4A0A12" style={{ flex: 1, lineHeight: 19 }}>
              {latest?.story ? latest.story : 'İlk görevini tamamladığında, kurumun anlattığı etki hikâyesi burada görünecek.'}
            </T>
          </View>
        </Card>
      </Pressable>

      <View style={{ gap: 12 }}>
        <SectionHeader title="Rozetlerim" action="Tümünü gör" onAction={() => router.push('/profil')} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {badges.slice(0, 4).map((b) => (
            <View key={b.id} style={{ width: 72, alignItems: 'center', gap: 6 }}>
              <HexBadge icon={b.icon} tone={b.tone} earned={b.earned} />
              <T w="semibold" size={11} color={b.earned ? colors.text : colors.muted} style={{ textAlign: 'center' }}>
                {b.name}
              </T>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

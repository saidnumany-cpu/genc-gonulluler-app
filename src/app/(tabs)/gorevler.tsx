import { useEffect, useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppData } from '@/lib/app-data';
import { CATEGORIES, type Category } from '@/lib/types';
import { Icon } from '@/components/Icon';
import { TaskCard } from '@/components/TaskCard';
import { Chip, Empty, Screen, T } from '@/components/ui';
import { colors, fonts, radius } from '@/theme';

type Filter = 'hepsi' | 'bana-uygun' | Category;

const normalize = (s: string) => s.toLocaleLowerCase('tr-TR');

export default function Gorevler() {
  const params = useLocalSearchParams<{ kategori?: Category }>();
  const { tasks, tasksLoading, claimByTask, isMatch } = useAppData();
  const [filter, setFilter] = useState<Filter>('bana-uygun');
  const [q, setQ] = useState('');
  const [where, setWhere] = useState<'hepsi' | 'uzaktan' | 'yerinde'>('hepsi');

  useEffect(() => {
    if (params.kategori) setFilter(params.kategori);
  }, [params.kategori]);

  const list = useMemo(() => {
    const needle = normalize(q.trim());
    return tasks
      .filter((t) => claimByTask[t.id]?.status !== 'approved')
      .filter((t) => (filter === 'hepsi' ? true : filter === 'bana-uygun' ? isMatch(t) : t.category === filter))
      .filter((t) => where === 'hepsi' || (t.mode ?? 'uzaktan') === where)
      .filter((t) => !needle || normalize(`${t.title} ${t.org} ${t.cause} ${t.city} ${t.place ?? ''}`).includes(needle))
      .sort((a, b) => Number(isMatch(b)) - Number(isMatch(a)));
  }, [tasks, claimByTask, filter, q, where, isMatch]);

  const filters: { id: Filter; label: string }[] = [
    { id: 'bana-uygun', label: 'Bana uygun' },
    { id: 'hepsi', label: 'Tümü' },
    ...CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.short })),
  ];

  return (
    <Screen>
      <View style={{ gap: 4 }}>
        <T w="semibold" size={13} color={colors.redDark}>
          Mikro görevler
        </T>
        <T w="extrabold" size={26} style={{ letterSpacing: -0.8, lineHeight: 32 }} accessibilityRole="header">
          Bildiğin işle{'\n'}fark yarat.
        </T>
        <T size={14} color={colors.muted} style={{ marginTop: 4, lineHeight: 20 }}>
          Evden yapılan kısa işlerden sahadaki etkinliklere: yeteneğine uygun her şey.
        </T>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.md,
          paddingHorizontal: 14,
          height: 50,
        }}
      >
        <Icon name="search" size={18} color={colors.muted} strokeWidth={2} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Görev, kurum, şehir ya da semt ara"
          placeholderTextColor="#8A8A90"
          accessibilityLabel="Görev ara"
          style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.ink, height: '100%' }}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }} style={{ marginRight: -20, flexGrow: 0 }}>
        {filters.map((f) => (
          <Chip key={f.id} label={f.label} active={filter === f.id} onPress={() => setFilter(f.id)} />
        ))}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(
          [
            ['hepsi', 'Her yer'],
            ['uzaktan', 'Uzaktan'],
            ['yerinde', 'Yerinde'],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} label={label} active={where === id} onPress={() => setWhere(id)} />
        ))}
      </View>

      <T w="semibold" size={13} color={colors.muted}>
        {tasksLoading ? 'Yükleniyor…' : `${list.length} görev`}
      </T>

      <View style={{ gap: 12 }}>
        {list.map((t) => (
          <TaskCard key={t.id} task={t} matched={isMatch(t)} status={claimByTask[t.id]?.status} />
        ))}
        {!tasksLoading && !list.length ? (
          <Empty
            text={
              filter === 'bana-uygun'
                ? 'Yeteneklerine uygun açık görev şu an yok. "Tümü" filtresine bak ya da profilinden yetenek ekle.'
                : 'Bu filtrede görev bulunamadı.'
            }
          />
        ) : null}
      </View>
    </Screen>
  );
}

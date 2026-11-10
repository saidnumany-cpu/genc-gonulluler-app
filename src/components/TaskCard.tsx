import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '@/theme';
import { categoryLabel, type ClaimStatus, type Task } from '@/lib/types';
import { Icon } from './Icon';
import { Pill, T } from './ui';

const statusText: Record<ClaimStatus, string> = {
  claimed: 'Üstlendin',
  submitted: 'Onay bekliyor',
  approved: 'Tamamlandı',
  rejected: 'Düzeltme istendi',
};

export function TaskCard({ task, matched, status }: { task: Task; matched: boolean; status?: ClaimStatus }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${task.title}, ${task.org}`}
      onPress={() => router.push({ pathname: '/gorev/[id]', params: { id: task.id } })}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: 18,
        gap: 12,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill label={categoryLabel(task.category)} />
        {status ? (
          <Pill label={statusText[status]} tone="ink" />
        ) : matched ? (
          <T w="bold" size={12} color={colors.redDark}>
            Yeteneğine uygun
          </T>
        ) : null}
      </View>
      <View style={{ gap: 4 }}>
        <T w="extrabold" size={16} style={{ lineHeight: 21 }}>
          {task.title}
        </T>
        <T size={13} color={colors.muted}>
          {task.org} · {task.city}
        </T>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.bg, borderRadius: radius.sm, padding: 10 }}>
        <Icon name="heart" size={16} color={colors.red} filled />
        <T w="semibold" size={13} color={colors.text} style={{ flex: 1, lineHeight: 18 }}>
          {task.impactText}
        </T>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <Icon name="clock" size={15} color={colors.muted} strokeWidth={2} />
            <T w="semibold" size={13} color={colors.muted}>
              {task.minutes} dk
            </T>
          </View>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <Icon name="laptop" size={15} color={colors.muted} strokeWidth={2} />
            <T w="semibold" size={13} color={colors.muted}>
              Uzaktan
            </T>
          </View>
        </View>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow" size={18} color={colors.white} strokeWidth={2.2} />
        </View>
      </View>
    </Pressable>
  );
}

import { NativeTabs } from 'expo-router/native-tabs';
import { colors, fonts } from '@/theme';

/**
 * iPhone ve Android: sistemin yerel sekme çubuğu.
 * iOS 26+ cihazlarda bu çubuk kendiliğinden Liquid Glass olur, kaydırınca küçülür.
 * Web sürümü `_layout.web.tsx` dosyasında (alt çubuk + bilgisayarda yan menü).
 */
export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={colors.red}
      iconColor={{ default: colors.muted, selected: colors.red }}
      labelStyle={{ default: { fontFamily: fonts.bold, color: colors.muted }, selected: { fontFamily: fonts.bold, color: colors.red } }}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: colors.bg }}>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
        <NativeTabs.Trigger.Label>Ana Sayfa</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="gorevler" contentStyle={{ backgroundColor: colors.bg }}>
        <NativeTabs.Trigger.Icon sf={{ default: 'checklist', selected: 'checklist' }} md="checklist" />
        <NativeTabs.Trigger.Label>Görevler</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="etki" contentStyle={{ backgroundColor: colors.bg }}>
        <NativeTabs.Trigger.Icon sf={{ default: 'heart', selected: 'heart.fill' }} md="favorite" />
        <NativeTabs.Trigger.Label>Etkim</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profil" contentStyle={{ backgroundColor: colors.bg }}>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
        <NativeTabs.Trigger.Label>Profil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

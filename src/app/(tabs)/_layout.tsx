import { Tabs } from 'expo-router/js-tabs';
import { Icon, type IconName } from '@/components/Icon';
import { colors, fonts } from '@/theme';

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <Icon name={icon} size={22} color={focused ? colors.red : colors.muted} filled={focused && icon !== 'tasks'} strokeWidth={focused ? 2.1 : 1.8} />
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={tab('Ana Sayfa', 'home')} />
      <Tabs.Screen name="gorevler" options={tab('Görevler', 'tasks')} />
      <Tabs.Screen name="etki" options={tab('Etkim', 'heart')} />
      <Tabs.Screen name="profil" options={tab('Profil', 'user')} />
    </Tabs>
  );
}

import { Pressable, View } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/Icon';
import { Avatar, T } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';
import { useLayout } from '@/lib/use-layout';
import { colors, fonts, radius } from '@/theme';

const ICONS: Record<string, IconName> = { index: 'home', gorevler: 'tasks', etki: 'heart', profil: 'user', onizleme: 'eye' };

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <Icon name={icon} size={22} color={focused ? colors.red : colors.muted} filled={focused && icon !== 'tasks' && icon !== 'eye'} strokeWidth={focused ? 2.1 : 1.8} />
  ),
});

type SidebarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigateToTab: (routeKey: string) => void;
};

/** Bilgisayarda alt sekme çubuğu yerine soldaki gezinme menüsü. */
function Sidebar({ state, descriptors, navigateToTab }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  return (
    <View
      accessibilityRole="navigation"
      style={{
        width: 248,
        backgroundColor: colors.white,
        borderRightWidth: 1,
        borderRightColor: colors.border,
        paddingTop: insets.top + 28,
        paddingBottom: 24,
        paddingHorizontal: 16,
        gap: 28,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
          <T w="extrabold" size={16} color={colors.white}>
            GG
          </T>
        </View>
        <T w="extrabold" size={16} style={{ lineHeight: 19 }}>
          Genç{'\n'}Gönüllüler
        </T>
      </View>

      <View style={{ gap: 4 }}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const icon = ICONS[route.name] ?? 'home';
          return (
            <Pressable
              key={route.key}
              accessibilityRole="link"
              accessibilityState={{ selected: focused }}
              onPress={() => navigateToTab(route.key)}
              style={(s) => {
                const hovered = (s as { hovered?: boolean }).hovered;
                return {
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  height: 46,
                  paddingHorizontal: 14,
                  borderRadius: radius.sm,
                  backgroundColor: focused ? colors.redSoft : hovered ? colors.bg : 'transparent',
                };
              }}
            >
              <Icon name={icon} size={20} color={focused ? colors.red : colors.muted} filled={focused && icon !== 'tasks' && icon !== 'eye'} strokeWidth={focused ? 2.1 : 1.8} />
              <T w={focused ? 'extrabold' : 'semibold'} size={15} color={focused ? colors.redDark : colors.text}>
                {descriptors[route.key]?.options.title ?? route.name}
              </T>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      {profile ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: colors.bg }}>
          <Avatar name={profile.name} size={36} photo={profile.photo} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <T w="bold" size={14} numberOfLines={1}>
              {profile.name}
            </T>
            <T size={12} color={colors.muted}>
              Gönüllü
            </T>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function TabsLayout() {
  const { isDesktop } = useLayout();
  return (
    <Tabs
      tabBar={isDesktop ? (props) => <Sidebar {...(props as unknown as SidebarProps)} /> : undefined}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isDesktop ? 'left' : 'bottom',
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
      <Tabs.Screen name="onizleme" options={tab('Önizleme', 'eye')} />
    </Tabs>
  );
}

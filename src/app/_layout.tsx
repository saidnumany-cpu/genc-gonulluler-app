import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { AppDataProvider } from '@/lib/app-data';
import { isFirebaseConfigured } from '@/lib/firebase';
import { T } from '@/components/ui';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootStack() {
  const { ready, user, profile, profileLoaded } = useAuth();
  const loading = !ready || (user && !profileLoaded);

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync().catch(() => {});
  }, [loading]);

  if (loading) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const signedIn = !!user;
  const onboarded = !!profile && profile.skills.length > 0;

  return (
    <AppDataProvider>
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="giris" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !onboarded}>
        <Stack.Screen name="yetenekler" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="gorev/[id]" />
        <Stack.Screen name="yonetim" />
      </Stack.Protected>
    </Stack>
    </AppDataProvider>
  );
}

function SetupNeeded() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 }}>
      <T w="extrabold" size={20}>
        Firebase ayarı eksik
      </T>
      <T color={colors.muted} style={{ textAlign: 'center', lineHeight: 20 }}>
        .env dosyasını (yerelde) ya da Vercel / EAS ortam değişkenlerini README'deki gibi doldurun.
      </T>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {isFirebaseConfigured ? (
        <AuthProvider>
          <RootStack />
        </AuthProvider>
      ) : (
        <SetupNeeded />
      )}
    </SafeAreaProvider>
  );
}

import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, View, type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

/** iOS 26+ ile derlenmiş uygulamada Liquid Glass gerçekten çizilebiliyor mu? */
const GLASS_SUPPORTED = (() => {
  if (Platform.OS !== 'ios') return false;
  try {
    return isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
})();

/** Liquid Glass açık mı? "Saydamlığı azalt" erişilebilirlik ayarı açıksa düz renge düşer. */
export function useLiquidGlass() {
  const [reduceTransparency, setReduceTransparency] = useState(false);
  useEffect(() => {
    if (!GLASS_SUPPORTED) return;
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduceTransparency);
    return () => sub.remove();
  }, []);
  return GLASS_SUPPORTED && !reduceTransparency;
}

/**
 * Cam yüzey. iPhone'da (iOS 26+) yerel Liquid Glass; web, Android ve eski iOS'ta
 * `fallbackColor` arka planlı sıradan bir View.
 */
export function Glass({
  children,
  style,
  tint,
  fallbackColor,
  variant = 'regular',
  interactive,
  colorScheme = 'light',
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: ColorValue;
  fallbackColor: ColorValue;
  variant?: 'regular' | 'clear';
  interactive?: boolean;
  colorScheme?: 'light' | 'dark' | 'auto';
}) {
  const glass = useLiquidGlass();
  if (!glass) return <View style={[{ backgroundColor: fallbackColor }, style]}>{children}</View>;
  return (
    <GlassView
      glassEffectStyle={variant}
      tintColor={tint}
      isInteractive={interactive}
      colorScheme={colorScheme}
      style={[{ overflow: 'hidden' }, style]}
    >
      {children}
    </GlassView>
  );
}

import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { colors, fonts, radius } from '@/theme';
import { Icon, type IconName } from './Icon';

type Weight = keyof typeof fonts;

export function T({
  w = 'regular',
  size = 14,
  color = colors.ink,
  style,
  ...rest
}: TextProps & { w?: Weight; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text {...rest} style={[{ fontFamily: fonts[w], fontSize: size, color }, style]} />;
}

export function Screen({ children, padTop = true }: { children: ReactNode; padTop?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{
        paddingTop: padTop ? insets.top + 16 : 0,
        paddingBottom: 32,
        paddingHorizontal: padTop ? 20 : 0,
        gap: 20,
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Card({ children, style, dark }: { children: ReactNode; style?: StyleProp<ViewStyle>; dark?: boolean }) {
  return (
    <View
      style={[
        {
          backgroundColor: dark ? colors.ink : colors.card,
          borderRadius: radius.lg,
          borderWidth: dark ? 0 : 1,
          borderColor: colors.border,
          padding: 18,
          gap: 12,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'dark' | 'outline' | 'ghost';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = { primary: colors.red, dark: colors.ink, outline: colors.white, ghost: 'transparent' }[variant];
  const fg = variant === 'primary' || variant === 'dark' ? colors.white : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height: 54,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.borderStrong,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: 20,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          <T w="extrabold" size={15} color={fg}>
            {label}
          </T>
          {icon ? <Icon name={icon} size={18} color={fg} strokeWidth={2.2} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function Chip({ label, active, onPress, dashed }: { label: string; active: boolean; onPress: () => void; dashed?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        height: 40,
        paddingHorizontal: 15,
        borderRadius: radius.pill,
        justifyContent: 'center',
        backgroundColor: active ? (dashed ? colors.red : colors.ink) : colors.white,
        borderWidth: 1,
        borderStyle: dashed && !active ? 'dashed' : 'solid',
        borderColor: active ? (dashed ? colors.red : colors.ink) : colors.borderStrong,
      }}
    >
      <T w="bold" size={13} color={active ? colors.white : colors.text}>
        {dashed ? (active ? '✓ ' : '+ ') : ''}
        {label}
      </T>
    </Pressable>
  );
}

export function Pill({ label, tone = 'soft' }: { label: string; tone?: 'soft' | 'ink' | 'white' | 'glass' }) {
  const map = {
    soft: [colors.redSoft, colors.redDark],
    ink: [colors.ink, colors.white],
    white: [colors.white, colors.redDark],
    glass: ['rgba(255,255,255,0.2)', colors.white],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, alignSelf: 'flex-start' }}>
      <T w="bold" size={12} color={fg}>
        {label}
      </T>
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <T w="extrabold" size={17} accessibilityRole="header">
        {title}
      </T>
      {action ? (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="link">
          <T w="semibold" size={13} color={colors.muted}>
            {action} →
          </T>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T w="semibold" size={13} color={colors.text}>
        {label}
      </T>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#8A8A90"
        {...props}
        style={[
          {
            minHeight: 50,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.white,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontFamily: fonts.medium,
            fontSize: 15,
            color: colors.ink,
          },
          props.style,
        ]}
      />
    </View>
  );
}

export function HexBadge({ icon, tone, earned, size = 58 }: { icon: IconName; tone: 'red' | 'ink'; earned: boolean; size?: number }) {
  const h = size * 1.1;
  const bg = earned ? (tone === 'red' ? colors.red : colors.ink) : '#ECEAE8';
  const fg = earned ? colors.white : '#8A8A90';
  return (
    <View style={{ width: size, height: h, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={h} viewBox="0 0 100 110" style={StyleSheet.absoluteFill}>
        <Polygon points="50,0 100,27.5 100,82.5 50,110 0,82.5 0,27.5" fill={bg} />
      </Svg>
      <Icon name={icon} size={size * 0.4} color={fg} strokeWidth={2} />
    </View>
  );
}

export function Ring({ value, label, progress, size = 120 }: { value: string; label: string; progress: number; size?: number }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 120 120" style={StyleSheet.absoluteFill}>
        <Circle cx={60} cy={60} r={r} fill="none" stroke={colors.redTrack} strokeWidth={10} />
        <Circle
          cx={60}
          cy={60}
          r={r}
          fill="none"
          stroke={colors.red}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - Math.max(0.02, Math.min(1, progress)))}
          transform="rotate(-90 60 60)"
        />
      </Svg>
      <T w="extrabold" size={24} style={{ letterSpacing: -0.6 }}>
        {value}
      </T>
      <T w="semibold" size={11} color={colors.muted} style={{ textAlign: 'center', lineHeight: 13 }}>
        {label}
      </T>
    </View>
  );
}

export function Avatar({ name, size = 44, dark = true }: { name: string; size?: number; dark?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: dark ? colors.ink : colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T w="extrabold" size={size * 0.38} color={dark ? colors.white : colors.red}>
        {(name.trim()[0] ?? '?').toLocaleUpperCase('tr-TR')}
      </T>
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <View style={{ padding: 20, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.borderStrong }}>
      <T size={14} color={colors.muted} style={{ textAlign: 'center', lineHeight: 20 }}>
        {text}
      </T>
    </View>
  );
}

export function Squiggle() {
  return (
    <Svg width={64} height={8} viewBox="0 0 64 8">
      <Path d="M2 5c10-3 20-3 30 0s20 2 30-2" stroke={colors.red} strokeWidth={3} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

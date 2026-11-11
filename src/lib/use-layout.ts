import { useWindowDimensions } from 'react-native';

/** Bilgisayar / geniş ekran düzeni için kırılım noktaları. */
export const BREAKPOINTS = { desktop: 900, large: 1440 };

export function useLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINTS.desktop;
  const isLarge = width >= BREAKPOINTS.large;
  return { width, isDesktop, isLarge };
}

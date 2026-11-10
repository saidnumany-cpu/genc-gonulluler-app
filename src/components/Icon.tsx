import type { Category } from '@/lib/types';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'home' | 'tasks' | 'heart' | 'user' | 'bell' | 'arrow' | 'back' | 'clock' | 'laptop' | 'search'
  | 'pen' | 'code' | 'camera' | 'chat' | 'star' | 'leaf' | 'bolt' | 'check' | 'share' | 'link' | 'logout' | 'shield' | 'plus'
  | 'book' | 'medkit' | 'users' | 'pin' | 'music' | 'briefcase' | 'globe';

interface Props {
  name: IconName;
  size?: number;
  color: string;
  filled?: boolean;
  strokeWidth?: number;
}

export function Icon({ name, size = 22, color, filled = false, strokeWidth = 1.9 }: Props) {
  const s = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const f = filled ? { fill: color, stroke: 'none' } : s;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === 'home' && <Path {...f} d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />}
      {name === 'tasks' && (
        <>
          <Rect {...s} x={4} y={4} width={16} height={17} rx={3} />
          <Path {...s} d="M9 3v3h6V3M8.5 13l2.5 2.5 4.5-4.5" />
        </>
      )}
      {name === 'heart' && (
        <Path {...f} d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2 0 3.6 1 5 2.8 1.4-1.8 3-2.8 5-2.8 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z" />
      )}
      {name === 'user' && (
        <>
          <Circle {...f} cx={12} cy={8} r={4} />
          <Path {...f} d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </>
      )}
      {name === 'bell' && <Path {...s} d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />}
      {name === 'arrow' && <Path {...s} d="M5 12h14M13 6l6 6-6 6" />}
      {name === 'back' && <Path {...s} d="M19 12H5M11 18l-6-6 6-6" />}
      {name === 'clock' && (
        <>
          <Circle {...s} cx={12} cy={12} r={9} />
          <Path {...s} d="M12 7v5l3 2" />
        </>
      )}
      {name === 'laptop' && (
        <>
          <Rect {...s} x={2} y={4} width={20} height={14} rx={2} />
          <Path {...s} d="M8 21h8" />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle {...s} cx={11} cy={11} r={7} />
          <Path {...s} d="M20 20l-3.5-3.5" />
        </>
      )}
      {name === 'pen' && <Path {...s} d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />}
      {name === 'code' && <Path {...s} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />}
      {name === 'camera' && (
        <>
          <Path {...s} d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <Circle {...s} cx={12} cy={13} r={4} />
        </>
      )}
      {name === 'chat' && <Path {...s} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
      {name === 'star' && <Path {...s} d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" />}
      {name === 'leaf' && <Path {...s} d="M12 22V12M12 12C12 7 8 4 4 4c0 5 3 8 8 8zM12 12c0-4 3-7 8-7 0 4-3 7-8 7z" />}
      {name === 'bolt' && <Path {...s} d="M13 2L3 14h9l-1 8 10-12h-9z" />}
      {name === 'check' && <Path {...s} d="M5 12.5l4.5 4.5L19 7.5" />}
      {name === 'share' && <Path {...s} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />}
      {name === 'link' && <Path {...s} d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />}
      {name === 'logout' && <Path {...s} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />}
      {name === 'shield' && <Path {...s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
      {name === 'plus' && <Path {...s} d="M12 5v14M5 12h14" />}
      {name === 'book' && <Path {...s} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />}
      {name === 'medkit' && (
        <>
          <Rect {...s} x={3} y={7} width={18} height={14} rx={2} />
          <Path {...s} d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 11v6M9 14h6" />
        </>
      )}
      {name === 'users' && (
        <>
          <Circle {...s} cx={9} cy={8} r={3.5} />
          <Path {...s} d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14.3c2.1.7 3.5 2.8 3.5 5.7" />
        </>
      )}
      {name === 'pin' && (
        <>
          <Path {...s} d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
          <Circle {...s} cx={12} cy={10} r={2.5} />
        </>
      )}
      {name === 'music' && (
        <>
          <Path {...s} d="M9 18V5l12-2v13" />
          <Circle {...s} cx={6} cy={18} r={3} />
          <Circle {...s} cx={18} cy={16} r={3} />
        </>
      )}
      {name === 'briefcase' && (
        <>
          <Rect {...s} x={2} y={7} width={20} height={14} rx={2} />
          <Path {...s} d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20" />
        </>
      )}
      {name === 'globe' && (
        <>
          <Circle {...s} cx={12} cy={12} r={9.5} />
          <Path {...s} d="M2.5 12h19M12 2.5c2.5 2.6 3.8 5.8 3.8 9.5s-1.3 6.9-3.8 9.5c-2.5-2.6-3.8-5.8-3.8-9.5s1.3-6.9 3.8-9.5z" />
        </>
      )}
    </Svg>
  );
}

export const categoryIcon: Record<Category, IconName> = {
  tasarim: 'pen',
  kodlama: 'code',
  fotograf: 'camera',
  iletisim: 'chat',
  egitim: 'book',
  saglik: 'medkit',
  cevre: 'leaf',
  saha: 'pin',
  sosyal: 'users',
  sanat: 'music',
  uzmanlik: 'briefcase',
  dil: 'globe',
};

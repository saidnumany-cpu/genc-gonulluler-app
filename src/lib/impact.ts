import { CAUSES, type Claim } from './types';

export interface ImpactSummary {
  people: number;
  tasks: number;
  orgs: number;
  byCause: { name: string; value: number }[];
  stories: Claim[];
}

export function summarize(claims: Claim[], sinceMs?: number): ImpactSummary {
  const done = claims
    .filter((c) => c.status === 'approved')
    .filter((c) => !sinceMs || (c.approvedAt?.toMillis?.() ?? 0) >= sinceMs)
    .sort((a, b) => (b.approvedAt?.toMillis?.() ?? 0) - (a.approvedAt?.toMillis?.() ?? 0));
  const byCause = CAUSES.map((name) => ({
    name,
    value: done.filter((c) => c.cause === name).reduce((s, c) => s + (c.impact ?? 0), 0),
  }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
  return {
    people: done.reduce((s, c) => s + (c.impact ?? 0), 0),
    tasks: done.length,
    orgs: new Set(done.map((c) => c.org)).size,
    byCause,
    stories: done,
  };
}

export const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
};

export const formatNumber = (n: number) => n.toLocaleString('tr-TR');

export type BadgeIcon = 'star' | 'pen' | 'code' | 'leaf' | 'heart' | 'bolt' | 'camera' | 'chat' | 'book' | 'users' | 'pin';

export interface Badge {
  id: string;
  name: string;
  hint: string;
  icon: BadgeIcon;
  earned: boolean;
  tone: 'red' | 'ink';
}

export function computeBadges(claims: Claim[]): Badge[] {
  const done = claims.filter((c) => c.status === 'approved');
  const people = done.reduce((s, c) => s + (c.impact ?? 0), 0);
  const cat = (k: string) => done.filter((c) => c.category === k).length;
  return [
    { id: 'ilk', name: 'İlk Etki', hint: 'İlk görevini tamamla', icon: 'star', earned: done.length >= 1, tone: 'red' },
    { id: 'bilgi', name: 'Bilgi Elçisi', hint: '3 eğitim görevi', icon: 'book', earned: cat('egitim') >= 3, tone: 'ink' },
    { id: 'gonul', name: 'Gönül Köprüsü', hint: '3 sosyal destek/sağlık görevi', icon: 'users', earned: cat('sosyal') + cat('saglik') >= 3, tone: 'red' },
    { id: 'saha', name: 'Saha Kahramanı', hint: '3 saha görevi', icon: 'pin', earned: cat('saha') >= 3, tone: 'ink' },
    { id: 'piksel', name: 'Piksel Kahramanı', hint: '3 tasarım görevi', icon: 'pen', earned: cat('tasarim') >= 3, tone: 'ink' },
    { id: 'kod', name: 'Kod Elçisi', hint: '3 kodlama görevi', icon: 'code', earned: cat('kodlama') >= 3, tone: 'ink' },
    { id: 'kare', name: 'Kadraj Ustası', hint: '3 fotoğraf/video görevi', icon: 'camera', earned: cat('fotograf') >= 3, tone: 'ink' },
    { id: 'ses', name: 'Ses Ol', hint: '3 iletişim görevi', icon: 'chat', earned: cat('iletisim') >= 3, tone: 'ink' },
    { id: 'doga', name: 'Doğa Dostu', hint: 'Bir çevre görevi', icon: 'leaf', earned: done.some((c) => c.cause === 'Çevre'), tone: 'red' },
    { id: 'yuz', name: '100 Hayat', hint: '100 kişiye ulaş', icon: 'heart', earned: people >= 100, tone: 'red' },
    { id: 'hizli', name: 'Hızlı Eller', hint: '5 görev tamamla', icon: 'bolt', earned: done.length >= 5, tone: 'ink' },
  ];
}

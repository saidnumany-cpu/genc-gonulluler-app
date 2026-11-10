import type { Timestamp } from 'firebase/firestore';

export type Category = 'tasarim' | 'kodlama' | 'fotograf' | 'iletisim';

export const CATEGORIES: { id: Category; label: string; short: string }[] = [
  { id: 'tasarim', label: 'Tasarım & Görsel', short: 'Tasarım' },
  { id: 'kodlama', label: 'Kodlama & Web', short: 'Kodlama' },
  { id: 'fotograf', label: 'Fotoğraf & Video', short: 'Fotoğraf' },
  { id: 'iletisim', label: 'İletişim & Metin', short: 'İletişim' },
];

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.short ?? c;

/** Kullanıcının seçebileceği yetenek etiketleri ve bağlı oldukları görev kategorisi. */
export const SKILL_TAGS: { tag: string; category: Category }[] = [
  { tag: 'Grafik tasarım', category: 'tasarim' },
  { tag: 'İllüstrasyon', category: 'tasarim' },
  { tag: 'Figma / UI', category: 'tasarim' },
  { tag: 'Web (HTML/CSS)', category: 'kodlama' },
  { tag: 'JavaScript', category: 'kodlama' },
  { tag: 'Python / Veri', category: 'kodlama' },
  { tag: 'Fotoğraf', category: 'fotograf' },
  { tag: 'Video kurgu', category: 'fotograf' },
  { tag: 'Sosyal medya', category: 'iletisim' },
  { tag: 'Metin yazarlığı', category: 'iletisim' },
  { tag: 'Çeviri', category: 'iletisim' },
];

export const categoriesForSkills = (skills: string[]): Category[] =>
  Array.from(new Set(SKILL_TAGS.filter((s) => skills.includes(s.tag)).map((s) => s.category)));

export const CAUSES = ['Eğitim', 'Kadın emeği', 'Hayvan hakları', 'Çevre', 'Afet & dayanışma', 'Sağlık'] as const;
export type Cause = (typeof CAUSES)[number];

export interface Task {
  id: string;
  title: string;
  org: string;
  city: string;
  category: Category;
  cause: Cause;
  minutes: number;
  /** "40 kadın üreticinin ürünü pazarda görünür olacak" gibi tek cümle. */
  impactText: string;
  /** Görev tamamlanınca ulaşılması beklenen kişi sayısı. */
  impactCount: number;
  steps: string[];
  active: boolean;
  createdAt?: Timestamp;
}

export type ClaimStatus = 'claimed' | 'submitted' | 'approved' | 'rejected';

export interface Claim {
  id: string;
  uid: string;
  userName: string;
  taskId: string;
  taskTitle: string;
  org: string;
  category: Category;
  cause: Cause;
  status: ClaimStatus;
  link?: string;
  /** Kurumun onayladığı gerçek etki (kişi). */
  impact?: number;
  /** Kurumun yazdığı kısa etki hikâyesi. */
  story?: string;
  createdAt?: Timestamp;
  submittedAt?: Timestamp;
  approvedAt?: Timestamp;
}

export interface UserProfile {
  uid: string;
  name: string;
  skills: string[];
  impactTotal: number;
  taskCount: number;
  role?: 'admin';
  createdAt?: Timestamp;
}

import type { Timestamp } from 'firebase/firestore';

export type Category =
  | 'tasarim'
  | 'kodlama'
  | 'fotograf'
  | 'iletisim'
  | 'egitim'
  | 'saglik'
  | 'cevre'
  | 'saha'
  | 'sosyal'
  | 'sanat'
  | 'uzmanlik'
  | 'dil';

export const CATEGORIES: { id: Category; label: string; short: string }[] = [
  { id: 'egitim', label: 'Eğitim & Mentorluk', short: 'Eğitim' },
  { id: 'tasarim', label: 'Tasarım & Görsel', short: 'Tasarım' },
  { id: 'kodlama', label: 'Kodlama & Teknoloji', short: 'Teknoloji' },
  { id: 'fotograf', label: 'Fotoğraf & Video', short: 'Fotoğraf' },
  { id: 'iletisim', label: 'İletişim & Medya', short: 'İletişim' },
  { id: 'dil', label: 'Dil & Çeviri', short: 'Dil' },
  { id: 'saglik', label: 'Sağlık & İlk Yardım', short: 'Sağlık' },
  { id: 'sosyal', label: 'Sosyal Destek & Bakım', short: 'Sosyal destek' },
  { id: 'cevre', label: 'Çevre & Hayvanlar', short: 'Çevre' },
  { id: 'saha', label: 'Saha, Etkinlik & Lojistik', short: 'Saha' },
  { id: 'sanat', label: 'Sanat, Müzik & Spor', short: 'Sanat & Spor' },
  { id: 'uzmanlik', label: 'Profesyonel Uzmanlık', short: 'Uzmanlık' },
];

export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.short ?? c;

/** Kullanıcının seçebileceği yetenek etiketleri ve bağlı oldukları görev kategorisi. */
export const SKILL_TAGS: { tag: string; category: Category }[] = [
  // Eğitim & Mentorluk
  { tag: 'Ders anlatımı / etüt', category: 'egitim' },
  { tag: 'Matematik & fen', category: 'egitim' },
  { tag: 'Okuma-yazma desteği', category: 'egitim' },
  { tag: 'Kariyer mentorluğu', category: 'egitim' },
  { tag: 'Atölye yürütme', category: 'egitim' },
  { tag: 'Okul öncesi etkinlik', category: 'egitim' },
  // Tasarım & Görsel
  { tag: 'Grafik tasarım', category: 'tasarim' },
  { tag: 'İllüstrasyon', category: 'tasarim' },
  { tag: 'Figma / UI', category: 'tasarim' },
  { tag: 'Sunum hazırlama', category: 'tasarim' },
  { tag: 'Animasyon', category: 'tasarim' },
  // Kodlama & Teknoloji
  { tag: 'Web (HTML/CSS)', category: 'kodlama' },
  { tag: 'JavaScript', category: 'kodlama' },
  { tag: 'Python / Veri', category: 'kodlama' },
  { tag: 'Mobil uygulama', category: 'kodlama' },
  { tag: 'Bilgisayar kurulumu & teknik destek', category: 'kodlama' },
  { tag: 'Excel / tablo', category: 'kodlama' },
  { tag: 'Dijital okuryazarlık eğitimi', category: 'kodlama' },
  // Fotoğraf & Video
  { tag: 'Fotoğraf', category: 'fotograf' },
  { tag: 'Video çekimi', category: 'fotograf' },
  { tag: 'Video kurgu', category: 'fotograf' },
  { tag: 'Drone çekimi', category: 'fotograf' },
  // İletişim & Medya
  { tag: 'Sosyal medya', category: 'iletisim' },
  { tag: 'Metin yazarlığı', category: 'iletisim' },
  { tag: 'Haber & bülten', category: 'iletisim' },
  { tag: 'Podcast & seslendirme', category: 'iletisim' },
  { tag: 'Kampanya & bağış toplama', category: 'iletisim' },
  { tag: 'Topluluk yönetimi', category: 'iletisim' },
  // Dil & Çeviri
  { tag: 'İngilizce', category: 'dil' },
  { tag: 'Arapça', category: 'dil' },
  { tag: 'Kürtçe', category: 'dil' },
  { tag: 'Almanca / Fransızca', category: 'dil' },
  { tag: 'İşaret dili', category: 'dil' },
  { tag: 'Altyazı & transkripsiyon', category: 'dil' },
  // Sağlık & İlk Yardım
  { tag: 'İlk yardım sertifikası', category: 'saglik' },
  { tag: 'Sağlık eğitimi (öğrenci/mezun)', category: 'saglik' },
  { tag: 'Kan bağışı organizasyonu', category: 'saglik' },
  { tag: 'Beslenme & diyet', category: 'saglik' },
  { tag: 'Psikolojik ilk yardım', category: 'saglik' },
  // Sosyal Destek & Bakım
  { tag: 'Yaşlı ziyareti & refakat', category: 'sosyal' },
  { tag: 'Engelli bireylere destek', category: 'sosyal' },
  { tag: 'Çocuklarla oyun & etkinlik', category: 'sosyal' },
  { tag: 'Mülteci & göçmen desteği', category: 'sosyal' },
  { tag: 'Akran desteği & dinleme', category: 'sosyal' },
  { tag: 'Gıda & giyim dağıtımı', category: 'sosyal' },
  // Çevre & Hayvanlar
  { tag: 'Ağaç dikimi', category: 'cevre' },
  { tag: 'Çevre temizliği', category: 'cevre' },
  { tag: 'Geri dönüşüm & sıfır atık', category: 'cevre' },
  { tag: 'Hayvan bakımı & besleme', category: 'cevre' },
  { tag: 'Sokak hayvanı sahiplendirme', category: 'cevre' },
  { tag: 'Bahçecilik & tarım', category: 'cevre' },
  // Saha, Etkinlik & Lojistik
  { tag: 'Etkinlik organizasyonu', category: 'saha' },
  { tag: 'Karşılama & kayıt masası', category: 'saha' },
  { tag: 'Sürücü (ehliyetli)', category: 'saha' },
  { tag: 'Depo & lojistik', category: 'saha' },
  { tag: 'Afet & acil durum gönüllülüğü', category: 'saha' },
  { tag: 'Tadilat & boya', category: 'saha' },
  { tag: 'Yemek pişirme', category: 'saha' },
  // Sanat, Müzik & Spor
  { tag: 'Müzik & enstrüman', category: 'sanat' },
  { tag: 'Tiyatro & drama', category: 'sanat' },
  { tag: 'Resim & el sanatları', category: 'sanat' },
  { tag: 'Dans', category: 'sanat' },
  { tag: 'Spor antrenörlüğü', category: 'sanat' },
  { tag: 'Satranç & zekâ oyunları', category: 'sanat' },
  // Profesyonel Uzmanlık
  { tag: 'Hukuk (öğrenci/mezun)', category: 'uzmanlik' },
  { tag: 'Muhasebe & finans', category: 'uzmanlik' },
  { tag: 'Pazarlama & marka', category: 'uzmanlik' },
  { tag: 'Proje yönetimi', category: 'uzmanlik' },
  { tag: 'Araştırma & anket', category: 'uzmanlik' },
  { tag: 'Hibe & proje yazımı', category: 'uzmanlik' },
  { tag: 'Mimarlık & mühendislik', category: 'uzmanlik' },
];

export const categoriesForSkills = (skills: string[]): Category[] =>
  Array.from(new Set(SKILL_TAGS.filter((s) => skills.includes(s.tag)).map((s) => s.category)));

export const CAUSES = [
  'Eğitim',
  'Çocuklar & gençler',
  'Kadın emeği',
  'Yaşlılar',
  'Engelli hakları',
  'Mülteci & göçmen',
  'Hayvan hakları',
  'Çevre',
  'Afet & dayanışma',
  'Yoksullukla mücadele',
  'Sağlık',
  'Kültür & sanat',
  'Spor',
] as const;
export type Cause = (typeof CAUSES)[number];

/** Görevin nerede yapılacağı. */
export type TaskMode = 'uzaktan' | 'yerinde';

export interface Task {
  id: string;
  title: string;
  org: string;
  city: string;
  category: Category;
  cause: Cause;
  minutes: number;
  /** Eski görevlerde yoksa "uzaktan" kabul edilir. */
  mode?: TaskMode;
  /** Yerinde görevler için adres ya da semt. */
  place?: string;
  /** Yerinde görevler için tarih/saat metni, örn. "16 Kasım Cmt, 10:00". */
  when?: string;
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
  /** Uzaktan görevlerde çalışma bağlantısı, yerinde görevlerde kısa katılım notu. */
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

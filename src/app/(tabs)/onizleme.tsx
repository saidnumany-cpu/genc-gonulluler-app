import { useState, type ReactNode } from 'react';
import { Image, ScrollView, View } from 'react-native';
import Constants from 'expo-constants';
import Svg, { Circle } from 'react-native-svg';
import { useAuth } from '@/lib/auth-context';
import { useAppData } from '@/lib/app-data';
import { categoryLabel, type Task } from '@/lib/types';
import { useLayout } from '@/lib/use-layout';
import { Icon, type IconName } from '@/components/Icon';
import { Avatar, Card, Chip, Grid, HexBadge, Pill, Screen, Squiggle, T } from '@/components/ui';
import { colors, radius } from '@/theme';

/**
 * Önizleme: uygulama App Store'da yayına girdiğinde nasıl görüneceğini gösterir
 * (mağaza sayfası, ana ekran ve bildirim, geliştirmeden yayına geçiş).
 * Buradaki puan, yorum ve indirme sayıları örnek veridir.
 */

const APP_ICON = require('@/assets/images/icon.png');
const STORE_BLUE = '#0A7AFF';

const FALLBACK_TASKS: Pick<Task, 'title' | 'org' | 'minutes' | 'category'>[] = [
  { title: 'Kooperatif için ürün etiketi tasarla', org: 'Kadın Emeği Kooperatifi', minutes: 20, category: 'tasarim' },
  { title: 'Hayvan barınağı ilanlarını düzenle', org: 'Patiler Derneği', minutes: 15, category: 'iletisim' },
  { title: 'Köy okulu için kitap listesi hazırla', org: 'Okuyan Köyler', minutes: 25, category: 'egitim' },
];

type Section = 'store' | 'home' | 'launch';
const SECTIONS: { id: Section; label: string }[] = [
  { id: 'store', label: 'App Store sayfası' },
  { id: 'home', label: 'Ana ekran ve bildirim' },
  { id: 'launch', label: 'Yayına geçiş' },
];

export default function Onizleme() {
  const { isDesktop } = useLayout();
  const { profile } = useAuth();
  const { tasks } = useAppData();
  const [section, setSection] = useState<Section>('store');

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build = Constants.expoConfig?.ios?.buildNumber ?? '1';
  const sample = (tasks.length ? tasks : FALLBACK_TASKS).slice(0, 3);

  return (
    <Screen wide>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Pill label={`Geliştirme sürümü · v${version} (${build})`} tone="ink" />
          <Pill label="Önizleme" />
        </View>
        <T w="extrabold" size={isDesktop ? 34 : 26} style={{ letterSpacing: -0.8, lineHeight: isDesktop ? 40 : 32 }} accessibilityRole="header">
          Yayına girince{'\n'}böyle görünecek.
        </T>
        <Squiggle />
        <T size={14} color={colors.muted} style={{ lineHeight: 21, maxWidth: 620 }}>
          Uygulama şu an geliştirme aşamasında ve iPhone'a Xcode ile yükleniyor. Bu sekme, App Store'da yayınlandığında kullanıcıların
          karşılaşacağı mağaza sayfasını, ana ekranı ve bildirimleri canlandırır.
        </T>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {SECTIONS.map((s) => (
          <Chip key={s.id} label={s.label} active={section === s.id} onPress={() => setSection(s.id)} />
        ))}
      </ScrollView>

      {section === 'store' ? <StoreSection sample={sample} isDesktop={isDesktop} version={version} /> : null}
      {section === 'home' ? <HomeSection sample={sample} isDesktop={isDesktop} name={profile?.name ?? 'Gönüllü'} photo={profile?.photo} /> : null}
      {section === 'launch' ? <LaunchSection isDesktop={isDesktop} /> : null}

      <T size={12} color={colors.muted} style={{ textAlign: 'center', lineHeight: 18 }}>
        Puan, yorum ve indirme sayıları temsilîdir; uygulama yayınlandığında gerçek verilerle değişir.
      </T>
    </Screen>
  );
}

/* ---------------- App Store sayfası ---------------- */

type SampleTask = Pick<Task, 'title' | 'org' | 'minutes' | 'category'>;

function StoreSection({ sample, isDesktop, version }: { sample: SampleTask[]; isDesktop: boolean; version: string }) {
  const shots: { caption: string; screen: ReactNode }[] = [
    { caption: 'Yeteneğine uygun\ngörevi bul', screen: <MiniHome task={sample[0]} /> },
    { caption: '15 dakikada\nbir hayata dokun', screen: <MiniTasks tasks={sample} /> },
    { caption: 'Etkini ve rozetlerini\ntakip et', screen: <MiniImpact /> },
  ];

  return (
    <Card style={{ padding: isDesktop ? 28 : 18, gap: 20, borderRadius: radius.xl }}>
      {/* Başlık satırı */}
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <Image source={APP_ICON} style={{ width: isDesktop ? 118 : 96, height: isDesktop ? 118 : 96, borderRadius: isDesktop ? 26 : 22 }} accessibilityLabel="Uygulama simgesi" />
        <View style={{ flex: 1, gap: 4 }}>
          <T w="extrabold" size={isDesktop ? 24 : 20} style={{ letterSpacing: -0.4 }}>
            Genç Gönüllüler
          </T>
          <T size={14} color={colors.muted}>
            Yeteneğinle bir hayata dokun
          </T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <View style={{ backgroundColor: STORE_BLUE, borderRadius: radius.pill, paddingHorizontal: 22, paddingVertical: 7 }}>
              <T w="extrabold" size={14} color={colors.white}>
                AL
              </T>
            </View>
            <T size={11} color={colors.muted}>
              Ücretsiz
            </T>
          </View>
        </View>
      </View>

      {/* Bilgi şeridi */}
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.divider, paddingVertical: 12 }}>
        {[
          ['1,2 B PUAN', '4,9', '★★★★★'],
          ['YAŞ', '4+', 'Yaş'],
          ['KATEGORİ', 'Yaşam', 'Tarzı'],
          ['DİL', 'TR', 'Türkçe'],
        ].map(([top, mid, bottom], i) => (
          <View key={top} style={{ flex: 1, alignItems: 'center', gap: 2, borderLeftWidth: i ? 1 : 0, borderLeftColor: colors.divider }}>
            <T w="semibold" size={10} color={colors.muted}>
              {top}
            </T>
            <T w="extrabold" size={18} color={colors.text}>
              {mid}
            </T>
            <T size={11} color={colors.muted}>
              {bottom}
            </T>
          </View>
        ))}
      </View>

      {/* Ekran görüntüleri */}
      <View style={{ gap: 10 }}>
        <T w="extrabold" size={17}>
          Önizleme
        </T>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingRight: 8 }}>
          {shots.map((s) => (
            <StoreShot key={s.caption} caption={s.caption}>
              {s.screen}
            </StoreShot>
          ))}
        </ScrollView>
      </View>

      <Grid columns={isDesktop ? 2 : 1} gap={16}>
        <View style={{ gap: 8 }}>
          <T w="extrabold" size={17}>
            Açıklama
          </T>
          <T size={14} color={colors.text} style={{ lineHeight: 21 }}>
            Genç Gönüllüler, yeteneklerini sivil toplum kuruluşlarının küçük ama gerçek ihtiyaçlarıyla buluşturur. Tasarım, kodlama,
            fotoğraf ya da iletişim… Sana uygun mikro görevi seç, 15–30 dakikada tamamla, kurumun anlattığı etki hikâyesiyle
            dokunduğun hayatları gör.
          </T>
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <T w="extrabold" size={17}>
              Yenilikler
            </T>
            <T size={12} color={colors.muted}>
              Sürüm {version}
            </T>
          </View>
          {['İlk sürüm: yetenek eşleştirme ve mikro görevler', 'Etki takibi, rozetler ve sıralama', 'Profil fotoğrafı ekleme'].map((x) => (
            <View key={x} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Icon name="check" size={16} color={colors.red} strokeWidth={2.4} />
              <T size={14} color={colors.text}>
                {x}
              </T>
            </View>
          ))}
        </View>
      </Grid>

      {/* Yorum + gizlilik */}
      <Grid columns={isDesktop ? 2 : 1} gap={12}>
        <View style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: 16, gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <T w="bold" size={14}>
              Boş vakitler anlam kazandı
            </T>
            <T size={12} color={colors.muted}>
              örnek yorum
            </T>
          </View>
          <T size={12} color="#F5A623">
            ★★★★★
          </T>
          <T size={13} color={colors.text} style={{ lineHeight: 19 }}>
            Okul çıkışı 20 dakikamı bir derneğin afişine ayırdım, ertesi gün kaç kişiye ulaştığını gördüm. Çok motive edici.
          </T>
        </View>
        <View style={{ backgroundColor: colors.bg, borderRadius: radius.md, padding: 16, gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Icon name="shield" size={18} color={colors.ink} strokeWidth={2} />
            <T w="bold" size={14}>
              Uygulama Gizliliği
            </T>
          </View>
          <T size={13} color={colors.text} style={{ lineHeight: 19 }}>
            Kimliğinle ilişkilendirilen veriler: ad, e-posta, profil fotoğrafı ve görev geçmişi. Seni izlemek için veri toplanmaz;
            hesabını uygulama içinden silebilirsin.
          </T>
        </View>
      </Grid>
    </Card>
  );
}

function StoreShot({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <View style={{ width: 196, height: 410, borderRadius: 26, backgroundColor: colors.red, padding: 12, paddingTop: 18, gap: 12, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', right: -60, top: -50, width: 170, height: 170, borderRadius: 85, borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)' }} />
      <T w="extrabold" size={16} color={colors.white} style={{ textAlign: 'center', lineHeight: 20 }}>
        {caption}
      </T>
      <PhoneFrame>{children}</PhoneFrame>
    </View>
  );
}

function PhoneFrame({ children, width = 172, height = 330 }: { children: ReactNode; width?: number; height?: number }) {
  return (
    <View style={{ width, height, alignSelf: 'center', borderRadius: 28, backgroundColor: colors.ink, padding: 5 }}>
      <View style={{ flex: 1, borderRadius: 23, backgroundColor: colors.bg, overflow: 'hidden' }}>
        <View style={{ height: 22, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 52, height: 14, borderRadius: 8, backgroundColor: colors.ink }} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 9, gap: 7 }}>{children}</View>
        <MiniTabBar />
      </View>
    </View>
  );
}

function MiniTabBar() {
  const items: IconName[] = ['home', 'tasks', 'heart', 'user'];
  return (
    <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border }}>
      {items.map((n, i) => (
        <Icon key={n} name={n} size={13} color={i === 0 ? colors.red : colors.muted} filled={i === 0} />
      ))}
    </View>
  );
}

function MiniHome({ task }: { task?: SampleTask }) {
  return (
    <>
      <T w="extrabold" size={11} style={{ lineHeight: 13 }}>
        Bugün yeteneğinle{'\n'}bir hayata dokun.
      </T>
      <View style={{ backgroundColor: colors.red, borderRadius: 12, padding: 9, gap: 4 }}>
        <T w="bold" size={6.5} color={colors.white} style={{ opacity: 0.9 }}>
          SENİN İÇİN EŞLEŞTİRDİK
        </T>
        <T w="extrabold" size={9.5} color={colors.white} numberOfLines={2} style={{ lineHeight: 12 }}>
          {task?.title ?? 'Yeni görev'}
        </T>
        <T size={7} color={colors.white} numberOfLines={1}>
          {task ? `${task.minutes} dk · ${task.org}` : ''}
        </T>
      </View>
      <T w="extrabold" size={8.5}>
        Yetenek eşleşmelerin
      </T>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {['Tasarım', 'Kodlama'].map((c) => (
          <View key={c} style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 9, padding: 6, gap: 3 }}>
            <View style={{ width: 14, height: 14, borderRadius: 5, backgroundColor: colors.redSoft }} />
            <T w="bold" size={7}>
              {c}
            </T>
          </View>
        ))}
      </View>
      <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 7, flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        <MiniRing size={34} progress={0.62} />
        <View style={{ gap: 2 }}>
          <T w="extrabold" size={8}>
            Etki takibi
          </T>
          <T size={6.5} color={colors.muted}>
            124 dokunulan hayat
          </T>
        </View>
      </View>
    </>
  );
}

function MiniTasks({ tasks }: { tasks: SampleTask[] }) {
  return (
    <>
      <T w="extrabold" size={12}>
        Görevler
      </T>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {['Tümü', 'Eşleşen', 'Uzaktan'].map((c, i) => (
          <View key={c} style={{ paddingHorizontal: 6, paddingVertical: 3, borderRadius: 99, backgroundColor: i === 1 ? colors.ink : colors.white, borderWidth: 1, borderColor: i === 1 ? colors.ink : colors.border }}>
            <T w="bold" size={6.5} color={i === 1 ? colors.white : colors.text}>
              {c}
            </T>
          </View>
        ))}
      </View>
      {tasks.map((t) => (
        <View key={t.title} style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 7, gap: 3 }}>
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.redSoft, borderRadius: 99, paddingHorizontal: 5, paddingVertical: 1.5 }}>
            <T w="bold" size={6} color={colors.redDark}>
              {categoryLabel(t.category)}
            </T>
          </View>
          <T w="bold" size={8} numberOfLines={2} style={{ lineHeight: 10 }}>
            {t.title}
          </T>
          <T size={6.5} color={colors.muted} numberOfLines={1}>
            {t.minutes} dk · {t.org}
          </T>
        </View>
      ))}
    </>
  );
}

function MiniImpact() {
  return (
    <>
      <T w="extrabold" size={12}>
        Etkim
      </T>
      <View style={{ alignItems: 'center', paddingVertical: 4 }}>
        <MiniRing size={74} progress={0.62} label="124" />
      </View>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {[
          ['8', 'görev'],
          ['5', 'kurum'],
          ['3', 'rozet'],
        ].map(([v, l]) => (
          <View key={l} style={{ flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 5, alignItems: 'center' }}>
            <T w="extrabold" size={10}>
              {v}
            </T>
            <T size={6} color={colors.muted}>
              {l}
            </T>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 4 }}>
        <HexBadge icon="star" tone="red" earned size={26} />
        <HexBadge icon="pen" tone="ink" earned size={26} />
        <HexBadge icon="heart" tone="red" earned size={26} />
        <HexBadge icon="bolt" tone="ink" earned={false} size={26} />
      </View>
    </>
  );
}

function MiniRing({ size, progress, label }: { size: number; progress: number; label?: string }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 120 120" style={{ position: 'absolute' }}>
        <Circle cx={60} cy={60} r={r} fill="none" stroke={colors.redTrack} strokeWidth={12} />
        <Circle
          cx={60}
          cy={60}
          r={r}
          fill="none"
          stroke={colors.red}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - progress)}
          transform="rotate(-90 60 60)"
        />
      </Svg>
      {label ? (
        <T w="extrabold" size={size * 0.22}>
          {label}
        </T>
      ) : null}
    </View>
  );
}

/* ---------------- Ana ekran ve bildirim ---------------- */

function HomeSection({ sample, isDesktop, name, photo }: { sample: SampleTask[]; isDesktop: boolean; name: string; photo?: string }) {
  const first = name.split(' ')[0];
  return (
    <Grid columns={isDesktop ? 2 : 1} gap={20}>
      <Card style={{ alignItems: 'center', gap: 14, paddingVertical: 24 }}>
        <T w="extrabold" size={16}>
          Ana ekranda
        </T>
        <View style={{ width: 250, height: 470, borderRadius: 40, backgroundColor: colors.ink, padding: 7 }}>
          <View style={{ flex: 1, borderRadius: 34, overflow: 'hidden', backgroundColor: '#3A0D14', paddingHorizontal: 18, paddingTop: 16 }}>
            <View style={{ position: 'absolute', left: -80, top: 60, width: 260, height: 260, borderRadius: 130, backgroundColor: colors.red, opacity: 0.55 }} />
            <View style={{ position: 'absolute', right: -90, bottom: -40, width: 240, height: 240, borderRadius: 120, backgroundColor: '#7A1220', opacity: 0.8 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 }}>
              <T w="bold" size={11} color={colors.white}>
                9:41
              </T>
              <View style={{ width: 70, height: 18, borderRadius: 10, backgroundColor: '#000' }} />
              <T w="bold" size={11} color={colors.white}>
                ●●●
              </T>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <View key={i} style={{ width: '25%', alignItems: 'center', gap: 4 }}>
                  {i === 5 ? (
                    <Image source={APP_ICON} style={{ width: 44, height: 44, borderRadius: 11 }} />
                  ) : (
                    <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.22)' }} />
                  )}
                  <T w={i === 5 ? 'bold' : 'regular'} size={8} color={colors.white} numberOfLines={1}>
                    {i === 5 ? 'Gönüllüler' : ''}
                  </T>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 24, padding: 10, marginBottom: 10 }}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.35)' }} />
              ))}
            </View>
          </View>
        </View>
        <T size={13} color={colors.muted} style={{ textAlign: 'center', maxWidth: 280, lineHeight: 19 }}>
          App Store'dan indirildiğinde simge ve “Gönüllüler” adıyla ana ekrana yerleşir.
        </T>
      </Card>

      <View style={{ gap: 20 }}>
        <Card style={{ gap: 14 }}>
          <T w="extrabold" size={16}>
            Kilit ekranı bildirimi
          </T>
          <View style={{ borderRadius: 24, backgroundColor: '#2A0A10', padding: 16, gap: 10, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', right: -50, top: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: colors.red, opacity: 0.5 }} />
            <T w="extrabold" size={44} color={colors.white} style={{ textAlign: 'center', letterSpacing: -1 }}>
              9:41
            </T>
            {[
              { title: 'Senin için yeni bir görev var', body: `${sample[0]?.title ?? 'Yeni görev'} · ${sample[0]?.minutes ?? 15} dk`, time: 'şimdi' },
              { title: 'Görevin onaylandı 🎉', body: `Tebrikler ${first}! Bu hafta 24 kişiye dokundun.`, time: '2 sa önce' },
            ].map((n) => (
              <View key={n.title} style={{ flexDirection: 'row', gap: 10, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 18, padding: 11, alignItems: 'center' }}>
                <Image source={APP_ICON} style={{ width: 34, height: 34, borderRadius: 8 }} />
                <View style={{ flex: 1, gap: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <T w="bold" size={13} numberOfLines={1} style={{ flex: 1 }}>
                      {n.title}
                    </T>
                    <T size={11} color={colors.muted}>
                      {n.time}
                    </T>
                  </View>
                  <T size={12} color={colors.text} numberOfLines={2}>
                    {n.body}
                  </T>
                </View>
              </View>
            ))}
          </View>
          <T size={12} color={colors.muted} style={{ lineHeight: 18 }}>
            Bildirimler yayın sürümünde eklenecek: yeni eşleşen görevler ve onaylanan teslimler için.
          </T>
        </Card>

        <Card style={{ gap: 12 }}>
          <T w="extrabold" size={16}>
            Topluluk içinde sen
          </T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name={name} size={48} photo={photo} />
            <View style={{ flex: 1 }}>
              <T w="bold" size={15}>
                {name}
              </T>
              <T size={12} color={colors.muted}>
                Diğer gönüllüler sıralamada seni böyle görür
              </T>
            </View>
          </View>
          {!photo ? (
            <T size={12} color={colors.redDark} style={{ lineHeight: 18 }}>
              İpucu: Profil sekmesinden bir fotoğraf eklersen burada ve sıralamada görünür.
            </T>
          ) : null}
        </Card>
      </View>
    </Grid>
  );
}

/* ---------------- Yayına geçiş ---------------- */

function LaunchSection({ isDesktop }: { isDesktop: boolean }) {
  const steps = [
    { title: 'Geliştirme', text: "Xcode ile iPhone'a kablolu kurulum, test verisiyle deneme.", state: 'now' },
    { title: 'TestFlight beta', text: 'Kulüp üyeleri ve birkaç dernekle kapalı test, geri bildirim toplama.', state: 'next' },
    { title: 'App Store incelemesi', text: 'Ekran görüntüleri, gizlilik bilgileri ve açıklama ile Apple incelemesine gönderim.', state: 'next' },
    { title: 'Yayında', text: "Herkes App Store'dan ücretsiz indirebilir; güncellemeler otomatik gelir.", state: 'next' },
  ] as const;

  const rows: [string, string, string][] = [
    ['Kurulum', 'Xcode ile, sadece geliştiricinin telefonuna', "App Store'dan herkes indirebilir"],
    ['Görevler', 'Örnek (test) görevler', 'Gerçek derneklerin yayınladığı görevler'],
    ['Kullanıcılar', 'Geliştirici ve birkaç test hesabı', 'Türkiye genelinde genç gönüllüler'],
    ['Bildirimler', 'Kapalı', 'Yeni görev ve onay bildirimleri'],
    ['Güncellemeler', 'Her seferinde yeniden derleme', 'Otomatik mağaza güncellemesi'],
    ['Süre sınırı', 'Ücretsiz hesapla 7 günde bir yenileme', 'Süresiz'],
  ];

  return (
    <View style={{ gap: 20 }}>
      <Card style={{ gap: 4 }}>
        <T w="extrabold" size={16} style={{ marginBottom: 10 }}>
          Yol haritası
        </T>
        {steps.map((s, i) => {
          const now = s.state === 'now';
          return (
            <View key={s.title} style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: now ? colors.red : colors.white,
                    borderWidth: now ? 0 : 2,
                    borderColor: colors.borderStrong,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <T w="extrabold" size={13} color={now ? colors.white : colors.muted}>
                    {i + 1}
                  </T>
                </View>
                {i < steps.length - 1 ? <View style={{ width: 2, flex: 1, minHeight: 18, backgroundColor: colors.border, marginVertical: 4 }} /> : null}
              </View>
              <View style={{ flex: 1, paddingBottom: 16, gap: 3 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <T w="extrabold" size={15}>
                    {s.title}
                  </T>
                  {now ? <Pill label="Şu an buradayız" /> : null}
                </View>
                <T size={13} color={colors.muted} style={{ lineHeight: 19 }}>
                  {s.text}
                </T>
              </View>
            </View>
          );
        })}
      </Card>

      <Card style={{ gap: 0, padding: 0, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', backgroundColor: colors.ink, paddingVertical: 12, paddingHorizontal: 16, gap: 10 }}>
          <T w="bold" size={12} color={colors.white} style={{ flex: isDesktop ? 0.8 : 0.9 }}>
            {' '}
          </T>
          <T w="bold" size={12} color={colors.white} style={{ flex: 1 }}>
            Şimdi (geliştirme)
          </T>
          <T w="bold" size={12} color={colors.redOnDark} style={{ flex: 1 }}>
            Yayında
          </T>
        </View>
        {rows.map(([label, dev, live], i) => (
          <View key={label} style={{ flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16, gap: 10, backgroundColor: i % 2 ? colors.bg : colors.card }}>
            <T w="bold" size={13} style={{ flex: isDesktop ? 0.8 : 0.9 }}>
              {label}
            </T>
            <T size={13} color={colors.muted} style={{ flex: 1, lineHeight: 18 }}>
              {dev}
            </T>
            <T w="semibold" size={13} color={colors.text} style={{ flex: 1, lineHeight: 18 }}>
              {live}
            </T>
          </View>
        ))}
      </Card>
    </View>
  );
}

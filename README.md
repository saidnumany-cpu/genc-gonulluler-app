# Genç Gönüllüler

Gençlerin yetenekleriyle (tasarım, kod, fotoğraf, metin) 15–60 dakikalık mikro gönüllülük görevleri yaptığı, puan yerine **dokundukları hayatları** gördüğü uygulama.

Tek kod tabanı üç yere çıkar:

| Nereye | Nasıl | Maliyet |
| --- | --- | --- |
| iPhone (TestFlight) | Expo EAS Build + Submit, **Mac gerekmez** | Apple Developer üyeliği (yıllık 99 $) dışında 0 ₺ |
| Web (her telefon/bilgisayar) | Vercel | 0 ₺ (Hobby planı) |
| Veritabanı + giriş | Firebase Spark planı | 0 ₺, kart gerekmez |

---

## Uygulamada neler var?

- **Giriş / kayıt** (e-posta + şifre, şifre sıfırlama)
- **Yetenek seçimi**: Kullanıcı yeteneklerini seçer, görevler buna göre eşleşir.
- **Ana Sayfa**: Sana uygun görev, devam eden görevlerin, etki halkası ve rozetler.
- **Görevler**: Arama ve filtreler ("Bana uygun", Tasarım, Kodlama, Fotoğraf, İletişim).
- **Görev detayı**: Görevi üstlen → çalışmanın bağlantısını teslim et → kurum onaylar.
- **Etkim**: Kurumun onayladığı gerçek kişi sayısı, nokta grafiği, etki alanlarına göre dağılım, kurumun yazdığı etki hikâyeleri ve paylaşma.
- **Profil**: Yetenekleri düzenleme, seviye, rozetler, etki sıralaması, çıkış ve hesap silme. Hesap silme seçeneği App Store kuralı gereği zorunlu.
- **Kurum paneli** (yalnızca yönetici): Teslimleri onaylama, etki hikâyesi yazma ve yeni görev ekleme.

> Etki sayısını kullanıcı kendisi şişiremez. Sayıyı yalnızca yönetici, teslimi onaylarken girer. Bu kural `firestore.rules` içinde sunucu tarafında da uygulanır.

> Ücretsiz Firebase planında Şubat 2026'dan beri dosya depolama (Storage) yok. Bu yüzden teslimler dosya yükleyerek değil, **Drive, Figma veya GitHub bağlantısıyla** yapılır. Bu sayede maliyet sıfır kalır.

---

## 1. Firebase kurulumu (~10 dk)

1. [console.firebase.google.com](https://console.firebase.google.com) adresinde **Proje ekle**'ye tıklayın. Google Analytics'i kapatabilirsiniz. Plan **Spark (ücretsiz)** kalsın.
2. **Build → Authentication → Get started → Sign-in method** bölümünde **E-posta/Şifre**'yi etkinleştirin.
3. **Build → Firestore Database → Create database** adımında:
   - Konum olarak `europe-west1` (veya size yakın bir bölge) seçin.
   - **Production mode** ile başlayın.
4. Firestore'da **Rules** sekmesini açın. Bu projedeki `firestore.rules` dosyasının tamamını yapıştırıp **Publish** deyin.
5. **Proje ayarları (⚙️) → Genel → Uygulamalarınız** bölümünde **Web (</>)** simgesine tıklayıp bir web uygulaması ekleyin. Size verilen `firebaseConfig` değerlerini not edin.

## 2. Bilgisayarda çalıştırma ve telefonda hemen deneme (~5 dk)

Gerekenler: [Node.js](https://nodejs.org) (LTS). Windows, Mac ve Linux'ta çalışır.

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
```

`.env` dosyasını 5. adımdaki Firebase değerleriyle doldurun. Sonra:

```bash
npx expo start
```

- Tarayıcıda açmak için **w** tuşuna basın.
- iPhone'da denemek için App Store'dan ücretsiz **Expo Go**'yu indirin ve terminaldeki QR kodu kamerayla okutun. Bu yöntem TestFlight'a gerek kalmadan anında test etmenizi sağlar.

### Kendinizi yönetici yapın ve örnek görevleri yükleyin

1. Uygulamada bir hesap açın ve yeteneklerinizi seçin.
2. Firebase konsolunda **Firestore → users** koleksiyonunu açın ve kendi belgenizi bulun.
3. Belgeye **Add field** ile `role` alanını ekleyin: tür `string`, değer `admin`.
4. Uygulamada **Profil → Kurum paneli → Örnek görevleri yükle** adımını izleyin. 7 örnek görev eklenir; kurum adları temsilidir, gerçekleriyle değiştirin.

## 3. Web sürümünü Vercel'e koyma (~5 dk)

1. Projeyi GitHub'a yükleyin. `.env` dosyası `.gitignore` içinde olduğu için yüklenmez.
2. [vercel.com](https://vercel.com) adresinde **Add New → Project** deyip repoyu seçin. Framework Preset olarak **Other** seçin; derleme ayarları `vercel.json` dosyasından otomatik okunur.
3. **Environment Variables** bölümüne `.env` içindeki 6 değişkeni aynen girin ve **Deploy**'a tıklayın.

Size `xxx.vercel.app` gibi bir adres verilir. Android kullanıcıları ve TestFlight'ı olmayanlar bu adresten kullanır; Safari'de **Paylaş → Ana Ekrana Ekle** ile uygulama gibi açılır.

> Vercel Hobby planı ticari olmayan kullanım içindir. Okul projesi ya da gönüllü bir girişim için uygundur.

## 4. iPhone'a TestFlight ile çıkarma (Mac gerekmez)

**Ön koşul:** Ücretli Apple Developer Program üyeliği (yıllık 99 $). TestFlight bu üyeliğe dahildir. Sadece Apple ID ile TestFlight'a yükleme yapılamaz.

```bash
npm install -g eas-cli
eas login                 # expo.dev'de ücretsiz hesap açın
eas init                  # projeyi Expo hesabınıza bağlar
```

Firebase değerlerini EAS'e bir kez girin (6 değişkenin her biri için):

```bash
eas env:create --environment production --visibility plaintext --name EXPO_PUBLIC_FIREBASE_API_KEY --value "..."
```

Sonra tek komutla derleyip TestFlight'a gönderin:

```bash
eas build -p ios --profile production --auto-submit
```

- İlk seferde Apple ID'nizle giriş ister. Sertifikaları, Bundle ID'yi ve App Store Connect kaydını **otomatik** oluşturur; her soruya "Yes" demeniz yeterli.
- `com.gencgonulluler.app` başkası tarafından alınmışsa `app.json` içindeki `bundleIdentifier` değerini değiştirin (örn. `com.adiniz.gencgonulluler`).
- Ücretsiz Expo planında ayda yaklaşık 15 iOS derlemesi yapılabilir. Ücretsiz kuyruk yoğun saatlerde bekletebilir.
- Derleme 15–30 dakikada biter. Apple'ın işlemesi için 10–30 dakika daha geçer.

### Test kullanıcılarını ekleme

[App Store Connect](https://appstoreconnect.apple.com) → uygulamanız → **TestFlight**:

| | Dahili test | Harici test |
| --- | --- | --- |
| Kimler | App Store Connect ekibinize eklediğiniz kişiler | Herkes (e-posta ya da **herkese açık bağlantı**) |
| Sınır | 100 kişi | 10.000 kişi |
| Apple incelemesi | Yok, hemen yüklenir | İlk derleme için **Beta App Review** (genelde 1–2 gün) |

Testçiler App Store'dan ücretsiz **TestFlight** uygulamasını indirip davetle yükler.

- Her TestFlight derlemesi **90 gün** sonra sona erer. Yeni sürüm için `eas build ... --auto-submit` komutunu tekrar çalıştırmanız yeterli; sürüm numarası otomatik artar.
- Harici testte Apple sizden bir **test hesabı** (e-posta/şifre) ister. Bunun için uygulamada bir demo hesap açıp bilgilerini **Test Information** bölümüne yazın.

---

## 5. Xcode ile kendi iPhone'una yükleme (Mac gerekir, ücretsiz Apple ID yeter)

Uygulama iOS 26'nın **Liquid Glass** tasarımını kullanır: alt sekme çubuğu sistemin yerel cam çubuğudur (kaydırınca küçülür), görev detayındaki geri düğmesi, "Senin için eşleştirdik" etiketi ve alttaki "Görevi üstlen" çubuğu cam yüzeydir. Cam efekti yalnızca **Xcode 26 veya üstüyle derlenip iOS 26+ çalışan iPhone'da** görünür; eski iOS'ta, Android'de ve web'de aynı öğeler düz renkle çizilir. "Saydamlığı Azalt" erişilebilirlik ayarı açıksa da düz renge döner.

**Bir kerelik hazırlık**

1. App Store'dan **Xcode 26+** kurun, bir kez açıp ek bileşenleri yükleyin. *Xcode → Settings → Accounts* bölümünden Apple ID'nizi ekleyin.
2. CocoaPods kurun: `brew install cocoapods`
3. iPhone'u kabloyla Mac'e bağlayın, "Bu bilgisayara güven" deyin. iPhone'da **Ayarlar → Gizlilik ve Güvenlik → Geliştirici Modu**'nu açın (telefon yeniden başlar).

**Derleme**

```bash
git clone https://github.com/saidnumany-cpu/genc-gonulluler-app.git
cd genc-gonulluler-app
npm install
npm run ios:xcode        # ios/ klasörünü üretir, pod'ları kurar ve Xcode'u açar
```

Xcode'da:

1. Soldan **GencGonulluler** projesini → **Signing & Capabilities** sekmesini açın.
2. **Team** olarak Apple ID'nizi (Personal Team) seçin. "Bundle identifier kullanılamıyor" hatası çıkarsa `app.json` içindeki `bundleIdentifier`'ı benzersiz yapın (örn. `com.saidnumany.gencgonulluler`) ve `npm run ios:xcode` komutunu tekrar çalıştırın.
3. Üstteki şemadan **Product → Scheme → Edit Scheme → Run → Build Configuration: Release** seçin. Release derlemesi JavaScript'i uygulamanın içine gömer, bilgisayar kapalıyken de çalışır. Firebase değerleri `.env.production` dosyasından otomatik alınır.
4. Cihaz olarak iPhone'unuzu seçip **▶︎ Run** (⌘R) deyin.
5. İlk açılışta iPhone "güvenilmeyen geliştirici" derse: **Ayarlar → Genel → VPN ve Aygıt Yönetimi** → Apple ID'niz → **Güven**.

Xcode'u açmadan tek komutla da yükleyebilirsiniz: `npm run ios:iphone` (imzalama ekibini bir kez Xcode'da seçtikten sonra).

- Ücretsiz Apple ID ile yüklenen uygulama **7 gün** sonra açılmaz olur; tekrar ⌘R ile yüklemeniz yeterli (veriler Firebase'de durduğu için kaybolmaz). Ücretli üyelikte bu süre 1 yıldır.
- `ios/` klasörü otomatik üretilir ve git'e eklenmez. Ayarları `app.json` üzerinden değiştirip `npm run ios:xcode` ile yeniden üretin; `ios/` içini elle düzenlemeyin.

---

## Proje yapısı

```
src/app/             Ekranlar (Expo Router: her dosya bir sayfa)
  giris.tsx          Giriş / kayıt
  yetenekler.tsx     İlk açılışta yetenek seçimi
  (tabs)/            Ana Sayfa, Görevler, Etkim, Profil (iOS/Android: yerel Liquid Glass sekme çubuğu, web: _layout.web.tsx)
  gorev/[id].tsx     Görev detayı ve teslim
  yonetim.tsx        Kurum paneli
src/components/      Ortak arayüz parçaları (kart, düğme, rozet, ikonlar, Glass.tsx = Liquid Glass yüzeyi)
src/lib/             Firebase, veri işlemleri, etki hesapları, örnek görevler
src/theme.ts         Renkler ve yazı tipleri
firestore.rules      Veritabanı güvenlik kuralları
```

## Veri modeli (Firestore)

- `tasks/{id}`: Görev bilgileri (başlık, kurum, kategori, etki cümlesi, beklenen kişi sayısı, adımlar)
- `users/{uid}`: Ad, yetenekler, toplam etki, görev sayısı, `role: "admin"` (isteğe bağlı)
- `claims/{uid_taskId}`: Üstlenme kaydı. Durum akışı: `claimed` → `submitted` → `approved`. Onaylanırken etki sayısı ve hikâye eklenir.

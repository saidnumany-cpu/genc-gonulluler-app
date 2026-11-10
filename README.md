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

## Proje yapısı

```
src/app/             Ekranlar (Expo Router: her dosya bir sayfa)
  giris.tsx          Giriş / kayıt
  yetenekler.tsx     İlk açılışta yetenek seçimi
  (tabs)/            Ana Sayfa, Görevler, Etkim, Profil
  gorev/[id].tsx     Görev detayı ve teslim
  yonetim.tsx        Kurum paneli
src/components/      Ortak arayüz parçaları (kart, düğme, rozet, ikonlar)
src/lib/             Firebase, veri işlemleri, etki hesapları, örnek görevler
src/theme.ts         Renkler ve yazı tipleri
firestore.rules      Veritabanı güvenlik kuralları
```

## Veri modeli (Firestore)

- `tasks/{id}`: Görev bilgileri (başlık, kurum, kategori, etki cümlesi, beklenen kişi sayısı, adımlar)
- `users/{uid}`: Ad, yetenekler, toplam etki, görev sayısı, `role: "admin"` (isteğe bağlı)
- `claims/{uid_taskId}`: Üstlenme kaydı. Durum akışı: `claimed` → `submitted` → `approved`. Onaylanırken etki sayısı ve hikâye eklenir.

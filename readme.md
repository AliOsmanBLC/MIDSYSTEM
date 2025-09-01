# IYS-Metunic Senkronizasyon Middleware

## 1. Genel Bakış
Bu proje, kurum içi bir sistem olan **Metunic** ile **İleti Yönetim Sistemi (IYS)** arasında çift yönlü izin (onay/ret) senkronizasyonunu sağlamak amacıyla geliştirilmiş bir **ara katman yazılımıdır (middleware)**.  

Sistem, hem **anlık bildirim** (webhook) hem de **periyodik kontrol** (scheduled sync) mekanizmaları ile çalışarak, iki taraf arasında tutarlı ve güvenilir veri bütünlüğü sağlar.  

## 2. Temel İşlevler
- **Metunic’ten IYS’ye:**  
  Metunic üzerinde gerçekleşen izin değişiklikleri webhook aracılığıyla anında IYS’ye işlenir.
- **IYS’den Metunic’e:**  
  Vatandaş tarafından IYS üzerinde yapılan izin değişiklikleri periyodik olarak kontrol edilerek Metunic’e yansıtılır.
- **Doğrulama Katmanı:**  
  Tüm giriş verileri **Zod şemaları** ile doğrulanır, tip güvenliği **TypeScript** ile sağlanır.

## 3. Teknolojiler
- **Çalışma Ortamı:** Node.js (v18+)  
- **Programlama Dili:** TypeScript  
- **Çerçeve:** Express  
- **Bağımlılıklar:** Axios, Zod, Dotenv  

## 4. Klasör Yapısı
```text
/
├── dist/                # Derlenmiş JavaScript dosyaları
├── node_modules/        # Proje bağımlılıkları
├── src/                 # TypeScript kaynak kodları
│   ├── services/        # IYS ve Metunic API entegrasyonları
│   ├── business-logic/  # İş kuralları ve senkronizasyon akışları
│   ├── config/          # Ortam değişkenleri ve yapılandırma
│   ├── types/           # Ortak tip tanımları
│   ├── validation/      # Veri doğrulama şemaları
│   └── index.ts         # Uygulama giriş noktası
│
├── .env                 # Ortam değişkenleri
├── .gitignore           # Versiyon kontrol hariç tutulan dosyalar
├── metunic-db.json      # Test amaçlı sahte Metunic veritabanı
├── package.json         # Proje bağımlılıkları ve komutları
└── tsconfig.json        # TypeScript derleyici ayarları
```

## 5. Kurulum

### 5.1 Gereksinimler
- Node.js (v18 veya üzeri)
- npm (Node.js ile birlikte gelir)

### 5.2 Adımlar
1. **Bağımlılıkların yüklenmesi:**
   ```bash
   npm install
   ```
2. **Ortam değişkenlerinin ayarlanması:**  
   Proje kök dizinine `.env` dosyası ekleyin. Örnek yapı:
   ```env
   PORT=3000
   IYS_API_BASE_URL=https://api.sandbox.iys.org.tr
   IYS_IYS_CODE=999999
   IYS_BRAND_CODE=123456
   IYS_USERNAME=sandbox_kullanici_adi
   IYS_PASSWORD=sandbox_sifresi
   ```

## 6. Çalıştırma

### 6.1 Geliştirme Modu
Değişiklikleri otomatik algılayarak sunucuyu yeniden başlatır:
```bash
npm run dev
```

### 6.2 Üretim Modu
1. Derleme:
   ```bash
   npm run build
   ```
2. Sunucu başlatma:
   ```bash
   npm start
   ```

Başarılı çalıştırma sonrası örnek çıktı:
```text
--- Middleware Sunucusu Başlatıldı ---
Sunucu: http://localhost:3000
Metunic Webhook: http://localhost:3000/webhooks/metunic
IYS Sync Test: http://localhost:3000/sync-iys
```

## 7. Test ve Doğrulama
- **Webhook testi:** Metunic sisteminden bir izin değişikliği simüle edilerek `/webhooks/metunic` endpoint’i üzerinden doğrulanabilir.  
- **IYS senkronizasyon testi:** `/sync-iys` endpoint’i çağrılarak periyodik senkronizasyon manuel tetiklenebilir.  

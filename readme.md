# MIDSYSTEM — IYS-Metunic Senkronizasyon Middleware

##  Genel Bakış
MIDSYSTEM, Metunic ve İleti Yönetim Sistemi (IYS) arasında çift yönlü izin senkronizasyonu sağlayan bir middleware uygulamasıdır. Webhook ile gerçek zamanlı veri akışı ve periyodik kontrol (cron destekli) mekanizmalarını bir arada kullanarak veri tutarlılığını sağlar.

## Öne Çıkan Özellikler
- **Metunic → IYS** yönünde webhook aracılığıyla anlık onay/ret senkronizasyonu
- **IYS → Metunic** yönünde periyodik (cron) senkronizasyon
- Tip güvenliği için **TypeScript**, veri doğrulama için **Zod** kullanımı
- HTTP istekleri için **Axios**, framework olarak **Express** kullanımı

## Teknolojiler
- Node.js (v18+)
- TypeScript
- Express
- Axios
- Zod
- Nodemon (geliştirme modunda otomatik yeniden başlatma)
- Prisma (veritabanı entegrasyonu)

## Proje Yapısı
/
├── prisma/ # Prisma şema ve migration dosyaları
├── src/
│ ├── config/ # Konfigürasyon ve yapılandırmalar
│ ├── services/ # IYS ve Metunic API entegrasyonları
│ ├── business-logic/ # Senkronizasyon akışları ve iş kuralları
│ ├── validation/ # Zod şemaları ile veri doğrulama
│ ├── types/ # Ortak TypeScript tip tanımları
│ └── index.ts # Uygulama giriş noktası
├── .gitignore
├── package.json
├── tsconfig.json
├── prisma.schema # Prisma veri modeli
└── README.md

## Başlangıç Kılavuzu

### 1. Gereksinimler
- Node.js (v18+)
- npm veya Yarn

### 2. Bağımlılıkların Yüklenmesi  
Tüm kütüphaneleri `.env` dosyasına ihtiyaç duymadan aşağıdaki komut ile kurabilirsiniz:
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

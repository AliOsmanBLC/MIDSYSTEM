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
npm install express axios zod prisma @prisma/client nodemon typescript ts-node
3. Prisma (Veritabanı İşlemleri)
Prisma kurulumunu yapmak ve veritabanı tablolarını oluşturmak için:
# Prisma başlatma
npx prisma init

# Şema tanımlamasından sonra migration oluşturma
npx prisma migrate dev --name init

# Veritabanı istemcisi oluşturma
npx prisma generate
4. Çalıştırma
# Kodları TypeScript’ten derle
npm run build

# Derlenmiş projeyi başlat
npm start
Not: package.json içinde build script’i genelde tsc komutunu, start script’i ise node dist/index.js çalıştıracak şekilde tanımlıdır. Eğer farklıysa kendi package.json’unuza göre güncelleyin.
5. Testler & Doğrulama
Webhook test: Metunic tarafında bir değişiklik simüle edilip POST /webhooks/metunic endpoint’ine istek gönderilerek test edilir.
Cron senkronizasyon testi: GET /sync-iys çağrılarak manuel tetikle tüm kontrol mekanizması çalıştırılır.
Sonuç
Bu proje, Metunic ve IYS sistemleri arasında güvenilir, esnek ve ölçeklenebilir bir senkronizasyon köprüsü sağlar. Hem otomatik webhook hem de periyodik cron mekanizmaları ile izin verilerinin her zaman güncel ve doğru kalmasını garanti eder.

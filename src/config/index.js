// src/config/index.ts
import * as dotenv from 'dotenv';
// Projenin ana dizinindeki .env dosyasını bulup okur
dotenv.config();
export const config = {
    iys: {
        baseUrl: process.env.IYS_API_BASE_URL || 'https://api.sandbox.iys.org.tr',
        brandCode: Number(process.env.IYS_BRAND_CODE),
        // Token almak için kullanılacak bilgiler.
        // Gerçek uygulamada bunları daha güvenli bir yerden (örn: secret manager) almalısınız.
        username: process.env.IYS_USERNAME,
        password: process.env.IYS_PASSWORD,
    },
    // Projenize özel diğer ayarlar buraya eklenebilir
};
//# sourceMappingURL=index.js.map
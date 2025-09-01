// src/index.ts
import { processConsentUpdate } from './business-logic/consent.logic.js';
// Uygulamayı başlatan ana fonksiyon
async function main() {
    console.log('--- IYS Senkronizasyon Uygulaması Başlatıldı ---');
    console.log(`--- Zaman: ${new Date().toLocaleTimeString('tr-TR')} ---`);
    // --- SENARYOLARI BURADA ÇALIŞTIRABİLİRSİNİZ ---
    // Örnek 1: Yeni bir kullanıcı kaydoldu ve SMS izni verdi.
    console.log('\n>>> Senaryo 1: Yeni kullanıcı onayı');
    const newUserConsent = {
        recipient: '5551112233', // Gerçek bir numara ile test edebilirsiniz
        recipientType: 'PHONE',
        status: 'APPROVE',
        type: 'MESSAGE',
    };
    await processConsentUpdate(newUserConsent);
    // Örnek 2: Mevcut bir kullanıcı iznini iptal etti.
    console.log('\n>>> Senaryo 2: Mevcut kullanıcı reddi');
    const existingUserRejection = {
        recipient: '5449998877', // Gerçek bir numara ile test edebilirsiniz
        recipientType: 'PHONE',
        status: 'REJECT',
        type: 'CALL',
    };
    await processConsentUpdate(existingUserRejection);
    console.log('\n--- Tüm işlemler tamamlandı. ---');
}
// Ana fonksiyonu çalıştır
main();
//# sourceMappingURL=index.js.map
// src/services/metunic.service.ts (TAM HALİ)

import { promises as fs } from 'fs';
import { resolve } from 'path';
import type { MetunicUser } from '../types/consent.types.js';

const dbPath = resolve(process.cwd(), 'metunic-db.json');


/**
 * Metunic veritabanında bir kullanıcının izin durumunu günceller.
 * Kullanıcıyı telefon veya e-posta ile bulur.
 * @param identifier Kullanıcının telefonu (+90...) veya e-postası
 * @param status Yeni izin durumu
 */
export async function updateMetunicConsent(
  identifier: string,
  status: 'APPROVE' | 'REJECT'
): Promise<void> {
  console.log(`(SAHTE) Metunic servisi çağrıldı: Alıcı=${identifier}, Durum=${status}`);
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const db: MetunicUser[] = JSON.parse(fileContent);

    // Kullanıcıyı telefon VEYA e-posta ile bul
    const user = db.find(u => u.phone === identifier || u.email === identifier);

    if (user) {
      console.log(`Kullanıcı (${identifier}) bulundu, izin durumu güncelleniyor...`);
      user.consentStatus = status;
      user.lastUpdated = new Date().toISOString();
    } else {
      console.log(`Kullanıcı (${identifier}) bulunamadı. Yeni kayıt eklenemedi (bu fonksiyon sadece günceller).`);
      // Gerçek senaryoda, IYS'den gelen ama sizde olmayan bir kullanıcı için
      // yeni bir Metunic kaydı oluşturup oluşturmayacağınıza karar vermelisiniz.
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    console.log(`(SAHTE) Metunic veritabanı başarıyla güncellendi: Alıcı=${identifier}`);
  } catch (error) {
    console.error(`(SAHTE) Metunic veritabanı güncellenirken bir hata oluştu:`, error);
    throw error;
  }
}
import axios from 'axios';
import {
  getIysAccessToken,
  updateIysConsent,
  getConsentChanges,
  getSingleConsent,
} from '../services/iys.service.js';
import { updateMetunicConsent } from '../services/metunic.service.js';
import type { ConsentInfo, IysChangeItem, MetunicUser } from '../types/consent.types.js'; 

// Metunic -> IYS
export async function handleConsentUpdateFromMetunic(metunicUser: MetunicUser) {
  console.log(`Metunic'ten gelen güncelleme: Alıcı=${metunicUser.email || metunicUser.phone}, Durum=${metunicUser.consentStatus}`);
  
  if (metunicUser.consentStatus === 'APPROVE') {
    console.log(`ONAY durumu için IYS'ye güncellemeler gönderiliyor...`);
    if (metunicUser.phone) {
      const phoneConsentTypes: ('MESSAGE' | 'CALL')[] = ['MESSAGE', 'CALL'];
      for (const type of phoneConsentTypes) {
        await processIysUpdate({
          recipient: metunicUser.phone.replace('+90', ''),
          recipientType: 'PHONE',
          status: 'APPROVE',
          type: type,
        });
      }
    }
    if (metunicUser.email) {
      await processIysUpdate({
        recipient: metunicUser.email,
        recipientType: 'EMAIL',
        status: 'APPROVE',
        type: 'EPOSTA',
      });
    }
  } else if (metunicUser.consentStatus === 'REJECT') {
    // ---- RET SENARYOSU (AKILLI KONTROL İLE) ----
    console.log(`RET durumu için IYS'de kullanıcının varlığı kontrol ediliyor...`);
    const accessToken = await getIysAccessToken();
    let userExistsInIys = false;

    if (metunicUser.phone) {
      const existingPhoneConsent = await getSingleConsent(metunicUser.phone, 'MESSAGE', accessToken);
      if (existingPhoneConsent) {
        userExistsInIys = true;
      }
    }

    if (!userExistsInIys && metunicUser.email) {
      const existingEmailConsent = await getSingleConsent(metunicUser.email, 'EPOSTA', accessToken);
      if (existingEmailConsent) {
        userExistsInIys = true;
      }
    }

    if (userExistsInIys) {
      console.log(`Kullanıcı IYS'de bulundu. RET güncellemeleri gönderiliyor...`);
      if (metunicUser.phone) {
        const phoneConsentTypes: ('MESSAGE' | 'CALL')[] = ['MESSAGE', 'CALL'];
        for (const type of phoneConsentTypes) {
          await processIysUpdate({ recipient: metunicUser.phone.replace('+90', ''), recipientType: 'PHONE', status: 'REJECT', type });
        }
      }
      if (metunicUser.email) {
        await processIysUpdate({ recipient: metunicUser.email, recipientType: 'EMAIL', status: 'REJECT', type: 'EPOSTA' });
      }
    } else {
      console.log(`Kullanıcı IYS'de bulunamadı. RET durumu için IYS'ye istek gönderilmeyecek.`);
    }
  }
}

async function processIysUpdate(consentInfo: ConsentInfo) {
  try {
    const accessToken = await getIysAccessToken();
    const params = { ...consentInfo, consentDate: new Date().toISOString() };
    const result = await updateIysConsent(params, accessToken);
    console.log(`IYS güncellemesi başarılı! Alıcı=${consentInfo.recipient}, Tür=${consentInfo.type}, Transaction ID: ${result.transactionId}`);
    return result;
  } catch (error) {
    console.error(`${consentInfo.recipient} için IYS güncellemesi başarısız oldu.`);
    if (axios.isAxiosError(error)) {
        console.error('>> Hata Detayı:', error.response?.data || error.message);
    } else if (error instanceof Error) {
        console.error('>> Hata Detayı (Genel):', error.message);
    } else {
        console.error('>> Bilinmeyen bir hata oluştu:', error);
    }
    return null;
  }
}


// IYS -> Metunic

// zamanlamalı çalıştırılmalı

export async function synchronizeChangesToMetunic() {
  console.log('\n>>> IYS\'den değişiklikler senkronize ediliyor...');
  try {
    const accessToken = await getIysAccessToken();
    const changes = await getConsentChanges(accessToken, { source: 'IYS' });

    if (!changes || !changes.list || changes.list.length === 0) {
      console.log('IYS tarafında yeni bir değişiklik bulunamadı.');
      return;
    }

    console.log(`${changes.list.length} adet yeni izin hareketi bulundu.`);
    
    const recipientsToUpdate = new Set<string>(
      changes.list.map((c: IysChangeItem) => c.recipient)
    );

    for (const recipient of recipientsToUpdate) {
      console.log(`Alıcı için durum kontrolü: ${recipient}`);

      const isApprovedOnIys = await checkFullApprovalOnIys(recipient, accessToken);
      
      const metunicStatus = isApprovedOnIys ? 'APPROVE' : 'REJECT';
      await updateMetunicConsent(recipient, metunicStatus);
    }

  } catch (error) {
    console.error('IYS senkronizasyonu sırasında bir hata oluştu.');
    if (axios.isAxiosError(error)) {
        console.error('>> Hata Detayı:', error.response?.data || error.message);
    } else if (error instanceof Error) {
        console.error('>> Hata Detayı (Genel):', error.message);
    } else {
        console.error('>> Bilinmeyen bir hata oluştu:', error);
    }
  }
}

/**
 * @param recipient E.164 formatında telefon (+90...)
 */
async function checkFullApprovalOnIys(recipient: string, accessToken: string): Promise<boolean> {
    const requiredTypes: ('MESSAGE' | 'CALL')[] = ['MESSAGE', 'CALL'];
    
    for(const type of requiredTypes) {
        const consent = await getSingleConsent(recipient, type, accessToken);

        if (!consent || consent.status !== 'ONAY') {
            console.log(`  - ${recipient} için ${type} izni ONAYLI DEĞİL. Genel durum: REJECT`);
            return false;
        }
    }
    
    console.log(`  - ${recipient} için tüm izinler ONAYLI. Genel durum: APPROVE`);
    return true;
}
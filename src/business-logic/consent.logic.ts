import axios from 'axios';
import {
  getIysAccessToken,
  updateIysConsent,
  getConsentChanges,
  getSingleConsent,
} from '../services/iys.service.js';
import { updateOurDatabase } from '../services/metunic.service.js';
import type { ConsentInfo, IysChangeItem, MetunicUser } from '../types/consent.types.js';

export async function handleConsentUpdateFromMetunic(metunicUser: MetunicUser) {
  console.log(`Metunic'ten gelen güncelleme: Alıcı=${metunicUser.email || metunicUser.phone}, Durum=${metunicUser.consentStatus}`);
  
  const processPhone = async () => {
    if (!metunicUser.phone) return;
    const phoneConsentTypes: ('MESSAGE' | 'CALL')[] = ['MESSAGE', 'CALL'];
    for (const type of phoneConsentTypes) {
      const consentInfo: ConsentInfo = {
        recipient: metunicUser.phone.replace('+90', ''),
        recipientType: 'PHONE',
        status: metunicUser.consentStatus,
        type: type,
      };
      const iysResult = await processIysUpdate(consentInfo);
      if (iysResult) await updateOurDatabase(consentInfo, 'FROM_METUNIC');
    }
  };

  const processEmail = async () => {
    if (!metunicUser.email) return;
    const consentInfo: ConsentInfo = {
      recipient: metunicUser.email,
      recipientType: 'EMAIL',
      status: metunicUser.consentStatus,
      type: 'EPOSTA',
    };
    const iysResult = await processIysUpdate(consentInfo);
    if (iysResult) await updateOurDatabase(consentInfo, 'FROM_METUNIC');
  };

  await processPhone();
  await processEmail();
}

async function processIysUpdate(consentInfo: ConsentInfo) {
  try {
    if (consentInfo.status === 'REJECT') {
      const accessToken = await getIysAccessToken();
      const existingConsent = await getSingleConsent(consentInfo.recipient, consentInfo.type, accessToken);
      if (!existingConsent) {
        console.log(`Kullanıcı (${consentInfo.recipient}) IYS'de bulunamadı. ${consentInfo.type} için RET durumu gönderilmeyecek.`);
        return null;
      }
    }
    const accessToken = await getIysAccessToken();
    const params = { ...consentInfo, consentDate: new Date().toISOString() };
    const result = await updateIysConsent(params, accessToken);
    if (result) console.log(`IYS güncellemesi başarılı! Transaction ID: ${result.transactionId}`);
    return result;
  } catch (error) {
    console.error(`${consentInfo.recipient} için IYS güncellemesi başarısız oldu.`);
    if (axios.isAxiosError(error)) console.error('>> Hata Detayı:', error.response?.data || error.message);
    return null;
  }
}


export async function synchronizeChangesToMetunic() {
  console.log('\n>>> IYS\'den değişiklikler senkronize ediliyor...');
  try {
    const accessToken = await getIysAccessToken();
    const changes = await getConsentChanges(accessToken, { source: 'IYS' });
    
    if (!changes || !changes.list || changes.list.length === 0) {
      console.log('IYS tarafında yeni bir değişiklik bulunamadı.');
      return;
    }

    for (const change of changes.list as IysChangeItem[]) {
      const consentInfo: ConsentInfo = {
        recipient: change.recipient,
        recipientType: change.recipient.includes('@') ? 'EMAIL' : 'PHONE',
        status: change.status === 'ONAY' ? 'APPROVE' : 'REJECT',
        type: change.type === 'MESAJ' ? 'MESSAGE' : (change.type === 'ARAMA' ? 'CALL' : 'EPOSTA')
      };
      await updateOurDatabase(consentInfo, 'FROM_IYS');
    }
  } catch (error) {
    console.error('IYS senkronizasyonu sırasında bir hata oluştu.');
    if (axios.isAxiosError(error)) console.error('>> Hata Detayı:', error.response?.data || error.message);
  }
}
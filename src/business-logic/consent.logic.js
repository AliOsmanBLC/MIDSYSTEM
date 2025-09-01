// src/business-logic/consent.logic.ts
import { getIysAccessToken, updateIysConsent } from '../services/iys.service.js';

export async function processConsentUpdate(consentInfo) {
    try {
        console.log(`İşlem başlıyor: Alıcı=${consentInfo.recipient}, Durum=${consentInfo.status}`);
        const accessToken = await getIysAccessToken();
        const params = {
            ...consentInfo,
            consentDate: new Date().toISOString(),
        };
        const result = await updateIysConsent(params, accessToken);

        console.log(`IYS güncellemesi başarılı! Transaction ID: ${result.transactionId}`);

        return result;
    }
    catch (error) {
        console.error(`${consentInfo.recipient} için IYS güncellemesi başarısız oldu.`);
        console.error(error); 
        return null;
    }
}

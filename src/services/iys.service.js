// src/services/iys.service.ts
import axios, { AxiosError } from 'axios';
import { config } from '../config/index.js'; // config bir klasör olduğu için içindeki index dosyasını hedefliyoruz
/**
 * IYS'ye tek bir izin durumunu gönderir.
 */
export async function updateIysConsent(params, accessToken) {
    if (!config.iys.brandCode) {
        throw new Error('IYS Marka Kodu (brandCode) yapılandırılmamış!');
    }
    const url = `${config.iys.baseUrl}/brands/${config.iys.brandCode}/consents`;
    try {
        const response = await axios.post(url, params, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        const axiosError = error;
        console.error('IYS API Hatası:', axiosError.response?.status, axiosError.response?.data);
        throw axiosError;
    }
}
/**
 * IYS'den yeni bir access token alır.
 * DİKKAT: Bu fonksiyonun içini kendi token alma mantığınıza göre doldurmalısınız.
 */
export async function getIysAccessToken() {
    console.log("IYS'den yeni access token isteniyor...");
    // BURASI ÇOK ÖNEMLİ:
    // Bu kısım, daha önce Postman'de yaptığımız token alma isteğinin kod halidir.
    // Gerçek bir uygulamada, token'ı her seferinde istemek yerine
    // süresi dolana kadar bir yerde (örn: cache) saklamalısınız.
    const tokenUrl = `${config.iys.baseUrl}/oauth2/token`;
    const body = {
        grant_type: 'password',
        username: config.iys.username,
        password: config.iys.password,
    };
    try {
        const response = await axios.post(tokenUrl, body, {
            headers: { 'Content-Type': 'application/json' }
        });
        const accessToken = response.data.access_token;
        if (!accessToken) {
            throw new Error('Yanıt içinde access_token bulunamadı.');
        }
        console.log("Yeni access token başarıyla alındı.");
        return accessToken;
    }
    catch (error) {
        console.error("IYS'den token alınırken ciddi bir hata oluştu!");
        throw error;
    }
}
//# sourceMappingURL=iys.service.js.map
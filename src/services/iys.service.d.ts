import type { UpdateConsentParams } from '../types/consent.types.js';
/**
 * IYS'ye tek bir izin durumunu gönderir.
 */
export declare function updateIysConsent(params: UpdateConsentParams, accessToken: string): Promise<any>;
/**
 * IYS'den yeni bir access token alır.
 * DİKKAT: Bu fonksiyonun içini kendi token alma mantığınıza göre doldurmalısınız.
 */
export declare function getIysAccessToken(): Promise<string>;
//# sourceMappingURL=iys.service.d.ts.map
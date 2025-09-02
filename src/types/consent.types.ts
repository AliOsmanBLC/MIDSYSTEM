export interface ConsentInfo {
  recipient: string;
  recipientType: 'PHONE' | 'EMAIL';
  status: 'APPROVE' | 'REJECT';
  type: 'MESSAGE' | 'CALL' | 'EPOSTA';
}

export interface UpdateConsentParams extends ConsentInfo {
  consentDate: string;
}

export interface IysChangeItem {
  recipient: string;
  type: string; 
  status: string; 
}

export interface MetunicWebhookPayload {
  email: string;
  phone?: string;
  consentStatus: 'APPROVE' | 'REJECT';
}

export interface MetunicUser extends MetunicWebhookPayload {
  lastUpdated: string;
}

export interface IysConsentPayload {
  source: string;
  recipient: string;
  recipientType: 'BIREYSEL' | 'TACIR';
  status: 'ONAY' | 'RET';
  type: 'MESAJ' | 'ARAMA' | 'EPOSTA';
  consentDate: string;
}
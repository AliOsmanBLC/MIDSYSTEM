// IYS için kullanılan tipler
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

// Metunic için olan tip
export interface MetunicUser {
  email: string;
  phone?: string;
  consentStatus: 'APPROVE' | 'REJECT';
  lastUpdated: string;
}
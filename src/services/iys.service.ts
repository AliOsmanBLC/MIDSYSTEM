import axios, { AxiosError } from 'axios';
import { config } from '../config/index.js';
import type { UpdateConsentParams } from '../types/consent.types.js';

function formatDateForIYS(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function updateIysConsent(
  params: UpdateConsentParams,
  accessToken: string
): Promise<any> {
  const { iysCode, brandCode } = config.iys;
  if (!iysCode || !brandCode) {
    throw new Error('IYS Kodu (iysCode) veya Marka Kodu (brandCode) yapılandırılmamış!');
  }

  const requestBody = {
    source: 'HS_WEB',
    recipient: params.recipientType === 'PHONE' ? `+90${params.recipient}` : params.recipient,
    recipientType: 'BIREYSEL',
    status: params.status === 'APPROVE' ? 'ONAY' : 'RET',
    type: params.type === 'MESSAGE' ? 'MESAJ' : 'ARAMA',
    consentDate: formatDateForIYS(new Date(params.consentDate)),
  };
  
  const url = `${config.iys.baseUrl}/sps/${iysCode}/brands/${brandCode}/consents`;

  try {
    console.log('İSTEK ATILAN URL (İzin Ekleme):', url);
    console.log('IYS\'ye Gönderilen Body:', requestBody);

    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function getConsentChanges(
  accessToken: string,
  options?: { after?: string; source?: 'IYS' | 'HS'; limit?: number }
): Promise<any> {
  const { iysCode, brandCode } = config.iys;
  if (!iysCode || !brandCode) {
    throw new Error('IYS Kodu (iysCode) veya Marka Kodu (brandCode) yapılandırılmamış!');
  }
  const url = `${config.iys.baseUrl}/sps/${iysCode}/brands/${brandCode}/consents/changes`;
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: options,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function getIysAccessToken(): Promise<string> {
  const tokenUrl = `${config.iys.baseUrl}/oauth2/token`;
  const body = {
    grant_type: 'password',
    username: config.iys.username,
    password: config.iys.password,
  };
  try {
    const response = await axios.post(tokenUrl, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    const accessToken = response.data.access_token;
    if (!accessToken) {
      throw new Error('Yanıt içinde access_token bulunamadı.');
    }
    return accessToken;
  } catch (error) {
    throw error;
  }
}

export async function getSingleConsent(
  recipient: string,
  type: 'MESSAGE' | 'CALL' | 'EPOSTA', 
  accessToken: string
): Promise<{ status: 'ONAY' | 'RET' } | null> {
  const { iysCode, brandCode } = config.iys;

  let iysType: string;
  if (type === 'MESSAGE') iysType = 'MESAJ';
  else if (type === 'CALL') iysType = 'ARAMA';
  else iysType = 'EPOSTA'; 
  
  const url = `${config.iys.baseUrl}/sps/${iysCode}/brands/${brandCode}/consents`;
  
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: {
        recipient: recipient,
        type: iysType,
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`${recipient} için ${type} sorgulanırken hata oluştu.`);
    return null;
  }
}
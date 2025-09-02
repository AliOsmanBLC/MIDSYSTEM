
import axios, { AxiosError } from 'axios';
import { config } from '../config/index.js';
import type { UpdateConsentParams } from '../types/consent.types.js';

function formatDateForIYS(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function updateIysConsent(params: UpdateConsentParams, accessToken: string): Promise<any> {
  const { iysCode, brandCode } = config.iys;
  if (!iysCode || !brandCode) {
    throw new Error('IYS Kodu (iysCode) veya Marka Kodu (brandCode) yapılandırılmamış!');
  }

  let iysType: 'MESAJ' | 'ARAMA' | 'EPOSTA';
  switch (params.type) {
    case 'MESSAGE': iysType = 'MESAJ'; break;
    case 'CALL':    iysType = 'ARAMA'; break;
    case 'EPOSTA':  iysType = 'EPOSTA'; break;
  }

  const requestBody = {
    source: 'HS_WEB',
    recipient: params.recipientType === 'PHONE' ? `+90${params.recipient}` : params.recipient,
    recipientType: 'BIREYSEL' as const,
    status: params.status === 'APPROVE' ? 'ONAY' : 'RET' as const,
    type: iysType,
    consentDate: formatDateForIYS(new Date(params.consentDate)),
  };
  
  const url = `${config.iys.baseUrl}/sps/${iysCode}/brands/${brandCode}/consents`;

  try {
    const response = await axios.post(url, requestBody, {
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getSingleConsent(recipient: string, type: 'MESSAGE' | 'CALL' | 'EPOSTA', accessToken: string): Promise<{ status: 'ONAY' | 'RET' } | null> {
  const { iysCode, brandCode } = config.iys;

  let iysType: string;
  let recipientTypeForQuery: string;
  switch (type) {
    case 'MESSAGE': iysType = 'MESAJ'; recipientTypeForQuery = 'PHONE'; break;
    case 'CALL':    iysType = 'ARAMA'; recipientTypeForQuery = 'PHONE'; break;
    case 'EPOSTA':  iysType = 'EPOSTA'; recipientTypeForQuery = 'EMAIL'; break;
  }
  
  const url = `${config.iys.baseUrl}/sps/${iysCode}/brands/${brandCode}/consents`;
  
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      params: { recipient, type: iysType, recipientType: 'BIREYSEL' }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    console.error(`${recipient} için ${type} sorgulanırken hata oluştu.`);
    return null;
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
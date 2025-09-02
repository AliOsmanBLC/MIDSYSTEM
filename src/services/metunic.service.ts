import prisma from './prisma.service.js';
import type { ConsentInfo } from '../types/consent.types.js';
import { Channel, Status, RecipientType, Direction } from '@prisma/client';

export async function updateOurDatabase(consent: ConsentInfo, direction: Direction) {
  console.log(`Veritabanı güncelleniyor: Alıcı=${consent.recipient}, Kanal=${consent.type}, Durum=${consent.status}, Yön=${direction}`);
  
  const dbStatus: Status = consent.status;
  const dbChannel: Channel = consent.type;
  const dbRecipientType: RecipientType = 'BIREYSEL';

  try {
    await prisma.consent.upsert({
      where: { recipient_channel: { recipient: consent.recipient, channel: dbChannel }},
      update: { status: dbStatus, type: dbRecipientType },
      create: {
        recipient: consent.recipient,
        channel: dbChannel,
        status: dbStatus,
        type: dbRecipientType,
        source: direction === 'FROM_METUNIC' ? 'HS_WEB' : 'IYS_WEB',
      },
    });
    await prisma.consentOperation.create({
      data: {
        recipient: consent.recipient,
        channel: dbChannel,
        status: dbStatus,
        type: dbRecipientType,
        direction: direction,
      },
    });
    console.log('Veritabanı başarıyla güncellendi.');
  } catch (error) {
    console.error('Veritabanı güncellenirken bir hata oluştu:', error);
  }
}
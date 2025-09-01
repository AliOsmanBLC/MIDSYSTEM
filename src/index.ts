import express from 'express';
import cron from 'node-cron';
import { config } from './config/index.js';
import { 
  handleConsentUpdateFromMetunic,
  synchronizeChangesToMetunic 
} from './business-logic/consent.logic.js';
import { metunicWebhookSchema } from './validation/consent.schema.js';
import type { MetunicUser } from './types/consent.types.js';

const app = express();

app.use(express.json());

app.post('/webhooks/metunic', async (req, res) => {
  console.log('>>> Metunic\'ten yeni bir webhook isteği alındı!', req.body);
  
  const validationResult = metunicWebhookSchema.safeParse(req.body);

  if (!validationResult.success) {
    console.error('Webhook verisi doğrulanamadı:', validationResult.error.flatten());
    return res.status(400).send({ 
        message: 'Geçersiz veya eksik veri.',
        errors: validationResult.error.flatten().fieldErrors 
    });
  }

  
  const validatedData = validationResult.data;
  const metunicUser: MetunicUser = {
    email: validatedData.email,
    consentStatus: validatedData.consentStatus,
    lastUpdated: new Date().toISOString()
  };

  if (validatedData.phone) {
    metunicUser.phone = validatedData.phone;
  }

  handleConsentUpdateFromMetunic(metunicUser);

  res.status(200).send({ message: 'Webhook başarıyla alındı ve işleme konuldu.' });
});


app.listen(config.port, () => {
  console.log(`--- Ara Katman Sunucusu Başlatıldı ---`);
  console.log(`🚀 Sunucu http://localhost:${config.port} adresinde çalışıyor`);
  console.log(`Metunic Webhook adresi: http://localhost:${config.port}/webhooks/metunic`);


  console.log('🕒 IYS -> Metunic senkronizasyon görevi zamanlandı (Her 15 dakikada bir çalışacak).');
  cron.schedule('*/1 * * * *', () => {
    console.log(`\n⏰ Zamanlanmış görev tetiklendi! (${new Date().toLocaleTimeString()})`);
    synchronizeChangesToMetunic();
  });
});
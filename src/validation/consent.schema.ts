import { z } from 'zod';

const phoneNumberSchema = z.string()
  .transform((phone, ctx) => {
    const cleaned = phone.replace(/[\s()-]/g, '');
    
    if (cleaned.startsWith('+90')) {
      if (cleaned.length === 13) return cleaned;
    }
    if (cleaned.startsWith('0')) {
      if (cleaned.length === 11) return `+90${cleaned.substring(1)}`;
    }
    if (/^[1-9]\d{9}$/.test(cleaned)) {
        return `+90${cleaned}`;
    }
    
    ctx.addIssue({
      code: 'custom',
      message: 'Geçersiz telefon numarası formatı. Numara +90, 0 veya doğrudan 10 hane olarak girilmelidir.',
    });
    return z.NEVER;
  });


export const metunicWebhookSchema = z.object({
  email: z.string().min(1, { message: 'E-posta alanı zorunludur.' }).email({ message: 'Geçersiz e-posta formatı.'}),
  
  phone: phoneNumberSchema.optional(),

  consentStatus: z.enum(['APPROVE', 'REJECT'], {
    message: 'İzin durumu sadece "APPROVE" veya "REJECT" olmalıdır.',
  }),
});

export type MetunicWebhookPayload = z.infer<typeof metunicWebhookSchema>;
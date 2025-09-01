import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  iys: {
    baseUrl: process.env.IYS_API_BASE_URL || 'https://api.sandbox.iys.org.tr',
    iysCode: Number(process.env.IYS_IYS_CODE),
    brandCode: Number(process.env.IYS_BRAND_CODE),
    username: process.env.IYS_USERNAME,
    password: process.env.IYS_PASSWORD,
  },
};
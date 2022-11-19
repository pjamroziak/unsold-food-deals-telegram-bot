import { ConfigType, registerAs } from '@nestjs/config';

export const telegramConfig = registerAs('telegram-config', () => ({
  access_token: process.env.TELEGRAM_ACCESS_TOKEN,
}));

export type TelegramConfig = ConfigType<typeof telegramConfig>;

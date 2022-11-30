import { ConfigType, registerAs } from '@nestjs/config';

export const internalApiConfig = registerAs('internal-api', () => ({
  baseUrl: process.env.API_BASE_URL,
}));

export const InternalApiConfigKey = internalApiConfig.KEY;

export type InternalApiConfig = ConfigType<typeof internalApiConfig>;

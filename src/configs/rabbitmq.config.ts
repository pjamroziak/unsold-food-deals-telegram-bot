import { ConfigType, registerAs } from '@nestjs/config';

export const rabbitmqConfig = registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL,
  queue: process.env.RABBITMQ_QUEUE,
}));

export const RabbitMQConfigKey = rabbitmqConfig.KEY;

export type RabbitMQConfig = ConfigType<typeof rabbitmqConfig>;

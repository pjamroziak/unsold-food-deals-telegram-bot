import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { internalApiConfig } from './configs/internal-api.config';
import { rabbitmqConfig } from './configs/rabbitmq.config';
import { telegramConfig } from './configs/telegram.config';
import { HandlersModule } from './handlers/handlers.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [internalApiConfig, rabbitmqConfig, telegramConfig],
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_ACCESS_TOKEN'),
        include: [TelegramModule],
        middlewares: [session()],
      }),
      inject: [ConfigService],
    }),
    TelegramModule,
    HandlersModule,
  ],
})
export class AppModule {}

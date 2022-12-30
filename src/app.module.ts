import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { internalApiConfig } from './configs/internal-api.config';
import { rabbitmqConfig } from './configs/rabbitmq.config';
import { telegramConfig } from './configs/telegram.config';
import { HandlersModule } from './handlers/handlers.module';
import { BotModule } from './bot/bot.module';
import LocalSession from 'telegraf-session-local';
import { I18n } from '@grammyjs/i18n';

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
        include: [BotModule],
        middlewares: [
          new LocalSession({ database: 'session.json' }).middleware(),
          new I18n({
            defaultLocale: 'pl',
            directory: 'locales',
          }).middleware(),
        ],
      }),
      inject: [ConfigService],
    }),
    BotModule,
    HandlersModule,
  ],
})
export class AppModule {}

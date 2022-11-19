import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { TasksModule } from './tasks/tasks.module';
import { TelegramModule } from './telegram/telegram.module';
import * as redisStore from 'cache-manager-redis-store';
import type { ClientOpts } from 'redis';
import { RavendbModule } from './ravendb/ravendb.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_ACCESS_TOKEN'),
        include: [TelegramModule],
        middlewares: [session()],
      }),
      inject: [ConfigService],
    }),
    RavendbModule,
    TelegramModule,
    TasksModule,
  ],
})
export class AppModule {}

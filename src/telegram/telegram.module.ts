import { Module } from '@nestjs/common';
import { RavendbService } from 'src/ravendb/ravendb.service';
import { TelegramOnUpdate } from './telegram.on';
import { TelegramSetupWizard } from './telegram.wizard';

@Module({
  providers: [TelegramOnUpdate, TelegramSetupWizard, RavendbService],
})
export class TelegramModule {}

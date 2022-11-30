import { InternalApiModule } from '@app/internal-api/internal-api.module';
import { Module } from '@nestjs/common';
import { TelegramOnUpdate } from './telegram.on';
import { TelegramSetupWizard } from './telegram.wizard';

@Module({
  imports: [InternalApiModule],
  providers: [TelegramOnUpdate, TelegramSetupWizard],
})
export class TelegramModule {}

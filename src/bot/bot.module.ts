import { InternalApiModule } from '@app/internal-api/internal-api.module';
import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotSetupWizard } from './bot.wizard';

@Module({
  imports: [InternalApiModule],
  providers: [BotUpdate, BotSetupWizard],
})
export class BotModule {}

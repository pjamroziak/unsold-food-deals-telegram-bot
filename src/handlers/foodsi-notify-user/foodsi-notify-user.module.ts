import { InternalApiModule } from '@app/internal-api/internal-api.module';
import { Module } from '@nestjs/common';
import { FoodsiNotifyUserEvent } from './foodsi-notify-user.event';

@Module({
  imports: [InternalApiModule],
  controllers: [FoodsiNotifyUserEvent],
})
export class FoodsiNotifyUserModule {}

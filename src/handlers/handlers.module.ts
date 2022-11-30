import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FoodsiNotifyUserModule } from './foodsi-notify-user/foodsi-notify-user.module';

@Module({
  imports: [FoodsiNotifyUserModule],
})
export class HandlersModule {}

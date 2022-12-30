import { FoodsiNotifyEventPayload, Offer } from '@app/common/types';
import { InternalApiService } from '@app/internal-api/internal-api.service';
import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class FoodsiNotifyUserEvent {
  private readonly logger = new Logger(FoodsiNotifyUserEvent.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly internalApiService: InternalApiService,
  ) {}

  @EventPattern('foodsi-notify-user')
  async handle(@Payload() data: FoodsiNotifyEventPayload) {
    const [user, offer] = await Promise.all([
      this.internalApiService.getUser(data.userId),
      this.internalApiService.getOffer(data.offerId),
    ]);

    if (!offer || !user || offer.stock === 0) {
      return;
    }

    try {
      await this.bot.telegram.sendMessage(
        user.telegramChatId,
        this.createMessage(offer),
      );
    } catch (error) {
      this.logger.error(
        `[Foodsi] Cannot send message to ${user.telegramChatId}, because: ${error.message}`,
        error.stack,
      );
    }
  }

  private createMessage(offer: Offer) {
    return `
*${offer.name}*:
Stock: ${offer.stock}
Price: ${offer.new_price} / ${offer.old_price} PLN
Description: ${offer.description}
Collect between: ${offer.opened_at} - ${offer.closed_at}
`;
  }
}

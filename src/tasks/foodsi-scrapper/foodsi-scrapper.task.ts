import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { InjectBot } from 'nestjs-telegraf';
import { Location } from 'src/commons/types';
import { RavendbService } from 'src/ravendb/ravendb.service';
import { Telegraf } from 'telegraf';
import { FoodsiScrapperService } from './foodsi-scrapper.service';

@Injectable()
export class FoodsiScrapperTask {
  private readonly logger = new Logger(FoodsiScrapperTask.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly dbService: RavendbService,
    private readonly service: FoodsiScrapperService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log('[Foodsi] Getting offers');

    const users = await this.dbService.listDocuments();

    for (const user of users) {
      const offers = await this.service.getOffers(user.location);

      const offersToNotify = [];
      if (user.notifications.length !== 0) {
        for (const notification of user.notifications) {
          const offer =
            offers[notification.restaurant_id + ':' + notification.package_id];
          if (offer && offer.stock !== notification.stock) {
            notification.stock = offer.stock;
            offersToNotify.push(offer);
          }
        }
      } else {
        const offersArray = Object.values(offers);
        offersToNotify.push(...offersArray);
      }

      let message = '';
      for (const offer of offersToNotify) {
        user.notifications.push({
          restaurant_id: offer.id,
          package_id: offer.package_id,
          stock: offer.stock,
        });
        message += `*${offer.name}*\nCena:${offer.prices.new}/${offer.prices.old} zł!\nIlość:${offer.stock}\n`;
      }

      if (message !== '') {
        await this.dbService.storeDocument(user);
        this.bot.telegram.sendMessage(user.chatId, message, {
          parse_mode: 'Markdown',
        });
      }
    }
    // this.logger.log(await this.service.getOffers());
    // const offers = await this.service.getOffers();

    // const message = `*${offers[0].name}*\nCena:${offers[0].prices.new}/${offers[0].prices.old} zł!`;
    // this.bot.telegram.sendPhoto('-1001855856735', offers[0].logoUrl, {
    //   caption: message,
    //   parse_mode: 'Markdown',
    // });
  }
}

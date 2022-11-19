import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  Command,
  Context,
  Hears,
  On,
  SceneEnter,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { Cache } from 'cache-manager';
import { Markup, Scenes } from 'telegraf';
import { TelegramTexts } from './telegram.texts';
import { RavendbService } from 'src/ravendb/ravendb.service';
import { User } from 'src/entitites/user.entity';

@Injectable()
@Wizard('setup')
export class TelegramSetupWizard {
  constructor(private readonly dbService: RavendbService) {}

  @SceneEnter()
  async enter(@Context() ctx: Scenes.WizardContext) {
    await ctx.reply(TelegramTexts.SETUP.WELCOME, { parse_mode: 'Markdown' });
    await ctx.reply(TelegramTexts.SETUP.KEY.ASK, { parse_mode: 'Markdown' });
  }

  @WizardStep(1)
  @Hears(/.+/)
  async step_1(@Context() ctx: Scenes.WizardContext) {
    if (ctx.message.text === '1234') {
      await ctx.reply(TelegramTexts.SETUP.KEY.VALID);
      await ctx.reply(
        TelegramTexts.SETUP.LOCATION.ASK,
        Markup.keyboard([
          Markup.button.locationRequest('Send your location!'),
        ]).resize(),
      );

      ctx.wizard.next();
    } else {
      await ctx.reply(TelegramTexts.SETUP.KEY.INVALID);
      ctx.scene.leave();
    }
  }

  @WizardStep(2)
  @On('location')
  @Command('cords')
  async location(@Context() ctx: Scenes.WizardContext) {
    if (
      ctx.update.message.text &&
      (ctx.update.message.text as string).startsWith('cords')
    ) {
      const parameters = ctx.update.message.text.split(' ');
      const latitude = Number(parameters[1]);
      const longitude = Number(parameters[2]);

      if (isNaN(latitude)) {
        await ctx.reply(TelegramTexts.SETUP.LOCATION.INVALID_LAT);
        return;
      } else if (isNaN(longitude)) {
        await ctx.reply(TelegramTexts.SETUP.LOCATION.INVALID_LNG);
        return;
      }

      ctx.message.location = {
        latitude,
        longitude,
      };
    }

    await this.dbService.storeDocument(
      new User(ctx.message.chat.id, ctx.message.location, []),
    );

    await ctx.reply(TelegramTexts.SETUP.LOCATION.VALID);
    ctx.scene.leave();
  }
}

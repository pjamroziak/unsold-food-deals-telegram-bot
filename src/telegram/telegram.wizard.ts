import { InternalApiService } from '@app/internal-api/internal-api.service';
import { Injectable } from '@nestjs/common';
import {
  Command,
  Ctx,
  Hears,
  On,
  SceneEnter,
  Wizard,
  WizardStep,
} from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { TelegramTexts } from './telegram.texts';

@Injectable()
@Wizard('setup')
export class TelegramSetupWizard {
  constructor(private readonly internalApiService: InternalApiService) {}

  @SceneEnter()
  async enter(@Ctx() ctx) {
    await ctx.reply(TelegramTexts.SETUP.WELCOME, { parse_mode: 'Markdown' });
    await ctx.reply(TelegramTexts.SETUP.KEY.ASK, { parse_mode: 'Markdown' });
  }

  @WizardStep(1)
  @Hears(/.+/)
  async step_1(@Ctx() ctx) {
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
  async location(@Ctx() ctx) {
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

      await ctx.reply(undefined, Markup.removeKeyboard());
    }

    const user = await this.internalApiService.createUser({
      telegramChatId: ctx.message.chat.id.toString(),
      latitude: ctx.message.location.latitude,
      longitude: ctx.message.location.longitude,
    });

    if (user.city === null) {
      await ctx.reply(TelegramTexts.SETUP.LOCATION.INVALID);
    } else {
      await ctx.reply(TelegramTexts.SETUP.LOCATION.VALID);
    }

    ctx.scene.leave();
  }
}

import { City, Cordinates } from '@app/common/types';
import { InternalApiService } from '@app/internal-api/internal-api.service';
import { Injectable } from '@nestjs/common';
import {
  Wizard,
  SceneEnter,
  Ctx,
  WizardStep,
  On,
  Action,
} from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { DefaultContext } from './bot.context';

@Injectable()
@Wizard('setup')
export class BotSetupWizard {
  constructor(private readonly internalApiService: InternalApiService) {}

  @SceneEnter()
  async sceneEnter(@Ctx() ctx: DefaultContext) {
    await ctx.reply(
      ctx.t('sendLocation'),
      Markup.keyboard([
        Markup.button.locationRequest(ctx.t('sendLocationBtn')),
      ]).resize(),
    );
  }

  @WizardStep(1)
  @On('location')
  async getLocation(@Ctx() ctx) {
    const cordinates: Cordinates = {
      latitude: ctx.message.location.latitude,
      longitude: ctx.message.location.longitude,
    };

    const foundCity: City = await this.internalApiService.getCityByCordinates(
      cordinates,
    );

    if (foundCity) {
      ctx.session.cordinates = cordinates;
      await ctx.reply(
        ctx.t('sendLocationFound', { city: foundCity.name }),
        Markup.inlineKeyboard([
          Markup.button.callback('👍', 'CONFIRM_CITY'),
          Markup.button.callback('👎', 'REJECT_CITY'),
        ]),
      );
    }
    // else {
    //   await ctx.reply(
    //     ctx.t('sendLocationNotFound'),
    //     Markup.keyboard([
    //       Markup.button.callback('👍', 'CONFIRM_SAVE_FOR_FUTURE'),
    //       Markup.button.callback('👎', 'REJECT_SAVE_FOR_FUTURE'),
    //     ]),
    //   );
    // }

    ctx.wizard.next();
  }

  @WizardStep(2)
  @Action('REJECT_CITY')
  async rejectCity(@Ctx() ctx) {
    await ctx.reply(
      ctx.t('sendLocationAgain'),
      Markup.keyboard([
        Markup.button.locationRequest(ctx.t('sendLocationBtn')),
      ]).resize(),
    );
    ctx.wizard.back();
  }

  @WizardStep(2)
  @Action('CONFIRM_CITY')
  async confirmCity(@Ctx() ctx) {
    const user = await this.internalApiService.createUser({
      telegramChatId: ctx.update.callback_query.from.id.toString(),
      latitude: ctx.session.cordinates.latitude,
      longitude: ctx.session.cordinates.longitude,
    });

    if (user && user.city !== null) {
      await ctx.reply(ctx.t('sendLocationFinish'), Markup.removeKeyboard());
    } else {
      await ctx.reply(ctx.t('sendLocationError'), Markup.removeKeyboard());
    }

    ctx.scene.leave();
  }
}

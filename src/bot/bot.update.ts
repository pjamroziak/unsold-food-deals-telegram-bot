import { Update, Start, Ctx, Command } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { DefaultContext } from './bot.context';

@Update()
export class BotUpdate {
  @Start()
  async start(@Ctx() ctx: DefaultContext) {
    await ctx.reply(ctx.t('greeting'), { parse_mode: 'Markdown' });
  }

  @Command('services')
  async displayServices(@Ctx() ctx: DefaultContext) {
    await ctx.reply(ctx.t('serviceList', { services: 'Foodsi' }), {
      parse_mode: 'Markdown',
    });
  }

  @Command('cities')
  async displayCities(@Ctx() ctx: DefaultContext) {
    await ctx.reply(ctx.t('cityList', { cities: 'Zielona Góra' }), {
      parse_mode: 'Markdown',
    });
  }

  @Command('setup')
  async hears(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('setup');
  }
}

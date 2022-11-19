import { Command, Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Scenes } from 'telegraf';
import { TelegramTexts } from './telegram.texts';

@Update()
export class TelegramOnUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(TelegramTexts.START, { parse_mode: 'Markdown' });
  }

  @Command('setup')
  async hears(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.enter('setup');
  }
}

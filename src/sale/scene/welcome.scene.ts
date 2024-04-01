import { Scene, SceneEnter, Ctx, Action, Sender } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Context, Markup } from 'telegraf';
import { SaleUpdate } from '../sale.update';
import { ConfigService } from '@nestjs/config';
import { RESET_DAY, SALE_DAY, TIMEZONE, TODAY } from '../sale.constant';

@Scene('WELCOME_SCENE')
export class WelcomeScene {
  constructor(
    private saleUpdate: SaleUpdate,
    private configService: ConfigService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: Context,
    @Sender('first_name') firstName: string,
    @Sender('last_name') lastName: string,
  ): Promise<void> {
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('💰 My Sale', 'sale'),
        Markup.button.callback('👤 My Profile', 'profile'),
      ],
      [
        Markup.button.callback('❓ Tutorial', 'tutorial'),
        Markup.button.callback('🤖 About', 'about'),
      ],
    ]);

    const user_joined = ['creator', 'administrator', 'member'].includes(
      (
        await ctx.telegram.getChatMember(
          this.configService.get<string>('TELEGRAM_GROUP_ID')!,
          ctx.message?.from.id ?? 0,
        )
      ).status,
    );

    const group_title: any = await ctx.telegram.getChat(
      this.configService.get<string>('TELEGRAM_GROUP_ID')!,
    );

    let message = `*🏠 Welcome*\n\n`;
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${TODAY}*, what can I help you today?\n\n`;

    message += `*Sale Time*\n`;
    message += `├ Sale Day : \`${SALE_DAY}\`\n`;
    message += `├ Reset Day : \`${RESET_DAY}\`\n`;
    message += `└ Timezone : \`${TIMEZONE}\`\n\n`;

    message += `*Sale Group*\n`;
    message += `├ Name : \`${group_title.title}\`\n`;
    message += `├ Joined : \`${user_joined ? 'Yes' : 'No'}\`\n`;
    message += `└ Link : [Click Here](${this.configService.get<string>('TELEGRAM_GROUP_LINK')})`;

    await ctx.replyWithMarkdownV2(message, {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: keyboard.reply_markup,
    });
  }

  @Action('sale')
  async onSaleAction(@Ctx() ctx: SceneContext): Promise<void> {
    await ctx.scene.enter('SALE_SCENE');
  }
}

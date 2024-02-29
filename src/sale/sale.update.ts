import { Hears, Start, Update, Ctx, Sender } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { SaleService } from './sale.service';
import {
  GROUP_NAME,
  RESET_DAY,
  SALE_DAY,
  TIMEZONE,
  TODAY,
} from './sale.constant';

@Update()
export class SaleUpdate {
  constructor(private saleService: SaleService) {}

  @Start()
  @Hears(['hi', 'hello', 'hey', 'qq', 'a'])
  async onGreetings(
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

    let message = `*🏠 Welcome*\n\n`;
    message += `Hello *${firstName}${lastName ? ' ' + lastName : ''}*, I'm [telegram\\-sale\\-bot](https://github.com/dodyagung/telegram-sale-bot)\\. Now is *${TODAY}}*, what can I help you today?\n\n`;

    message += `*Sale Time*\n`;
    message += `├ Sale Day : \`${SALE_DAY}\`\n`;
    message += `├ Reset Day : \`${RESET_DAY}\`\n`;
    message += `└ Timezone : \`${TIMEZONE}\`\n\n`;

    message += `*Sale Group*\n`;
    message += `├ Name : \`${GROUP_NAME}\`\n`;
    // message += `├ Joined : \`${this.saleService.resetDate()}\`\n`;
    // message += `└ Link : \`${this.saleService.timezone()}\`\n\n`;

    await ctx.replyWithMarkdownV2(message, {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: keyboard.reply_markup,
    });
  }
}

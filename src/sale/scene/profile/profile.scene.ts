import { Scene, SceneEnter, Ctx, Action, Hears } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/scenes';
import { Markup } from 'telegraf';
import { leaveScene, sendMessageWithKeyboard } from '../../sale.common';
import { SaleService } from '../../sale.service';

@Scene('PROFILE_SCENE')
export class ProfileScene {
  constructor(private saleService: SaleService) {}

  async getPhone(@Ctx() ctx: SceneContext): Promise<string | null | undefined> {
    return (await this.saleService.getPhone(ctx.from!.id.toString()))?.phone;
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext): Promise<void> {
    let keyboard;
    if (await this.getPhone(ctx)) {
      keyboard = [
        [
          Markup.button.callback('👈 Back', 'back'),
          Markup.button.callback('✏️ Edit', 'phone_edit'),
          Markup.button.callback('❌ Delete', 'phone_delete'),
        ],
      ];
    } else {
      keyboard = [
        [
          Markup.button.callback('👈 Back', 'back'),
          Markup.button.callback('✏️ Edit', 'phone_edit'),
        ],
      ];
    }

    let message: string = `*👤 My Profile*\n\n`;

    message += `This is your account information\\.\n`;
    message += `You can edit your *Telegram Info* via Telegram application settings\\.\n`;
    message += `For *Additional Info*, you can click Edit or Delete button bellow\\.\n\n`;

    message += `*Telegram Info*\n`;
    message += `├ ID : \`${ctx.from!.id}\`\n`;
    message += `├ Username : \`${ctx.from?.username ?? '<not set>'}\`\n`;
    message += `├ First Name : \`${ctx.from!.first_name}\`\n`;
    message += `└ Last Name : \`${ctx.from?.last_name ?? '<not set>'}\`\n\n`;

    message += `*Additional Info*\n`;
    message += `└ Phone : \`${(await this.getPhone(ctx)) ?? '<not set>'}\`\n\n`;

    sendMessageWithKeyboard(ctx, message, keyboard);
  }

  @Action('phone_edit')
  onPhoneEdit(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PHONE_EDIT_SCENE');
  }

  @Action('phone_delete')
  onPhoneDelete(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('PHONE_DELETE_SCENE');
  }

  @Action('back')
  onBack(@Ctx() ctx: SceneContext): void {
    ctx.scene.enter('WELCOME_SCENE');
  }

  @Hears(/.+/)
  onFallback(@Ctx() ctx: SceneContext): void {
    leaveScene(ctx);
  }
}

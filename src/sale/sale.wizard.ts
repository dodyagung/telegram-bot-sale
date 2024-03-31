import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardContext } from 'telegraf/scenes';

interface SaleScene {
  name: string;
}

@Wizard('SALE_WIZARD')
export class SaleWizard {
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: WizardContext): Promise<string> {
    console.log('Enter to scene');
    await ctx.wizard.next();
    return 'Welcome to wizard scene ✋ Send me your name';
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    console.log('Enter to step 1');
    (ctx.wizard.state as SaleScene).name = msg.text;
    await ctx.wizard.next();
    return 'Send me where are you from';
  }

  @On('text')
  @WizardStep(3)
  async onLocation(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    console.log('Enter to step 3');
    await ctx.scene.leave();
    return `Hello ${(ctx.wizard.state as SaleScene).name} from ${msg.text}. I'm Greater bot from 127.0.0.1 👋`;
  }
}

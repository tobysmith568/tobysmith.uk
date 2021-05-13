import { Router, Request, Response } from "express";
import { EmailService } from "src/services/email.service";
import { EnvironmentService } from "src/services/environment.service";
import { ExpressService } from "src/services/express.service";
import { singleton } from "tsyringe";
import { IController } from "./controller.interface";

interface SendMessageBody {
  name: string;
  email: string;
  message: string;
}

@singleton()
export class EmailController implements IController {
  private readonly router: Router;

  constructor(
    private readonly expressService: ExpressService,
    private readonly emailService: EmailService,
    private readonly environmentService: EnvironmentService
  ) {
    this.router = this.expressService.createRouter();

    this.router.post("", (req, res) => this.sendMessage(req, res));
  }

  private async sendMessage(req: Request, res: Response): Promise<void> {
    const { name, email, message } = req.body as SendMessageBody;
    const { from, to } = this.environmentService.config.email;

    const fullMessage = `The following message is from ${name}, ${email}\n\n${message}`;

    try {
      await this.emailService.sendTextEmail(to, name, from, `New message from ${name} via tobysmith.uk`, fullMessage);
    } catch {
      res.json({ success: false });
    }

    res.json({ success: true });
  }

  public getRouter(): Router {
    return this.router;
  }
}

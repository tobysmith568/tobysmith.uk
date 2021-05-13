import { singleton } from "tsyringe";
import { createTransport } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";
import { EnvironmentService } from "./environment.service";

@singleton()
export class EmailService {
  private static readonly SECUREPORT = 465;

  private transporter: Mail;

  constructor(environmentService: EnvironmentService) {
    const { host, port, user, pass } = environmentService.config.email;

    this.transporter = createTransport({
      host,
      port,
      secure: port === EmailService.SECUREPORT,
      auth: {
        user,
        pass
      }
    });
  }

  public async sendTextEmail(
    to: string,
    fromName: string,
    fromEmail: string,
    subject: string,
    text: string
  ): Promise<void> {
    const from = `${fromName} <${fromEmail}>`;

    await this.transporter.sendMail({
      from,
      to,
      subject,
      text
    });
  }
}

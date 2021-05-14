import { Component, Inject, OnInit } from "@angular/core";
import { EmailService } from "src/app/services/email/email.service";
import { TimeoutService } from "src/app/services/timeout/timeout.service";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";

type State = "unsent" | "saving" | "sent" | "error";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  public name = "";
  public email = "";
  public message = "";

  public state: State = "unsent";

  public get isValid(): boolean {
    const validName = !!this.name && this.name.length > 0;
    const validEmail = !!this.email && !!this.email.match(/^\S+@\S+\.\S+$/);
    const validMessage = !!this.message && this.message.length > 0;

    return validName && validEmail && validMessage;
  }

  constructor(
    @Inject(ENVIRONMENT) public readonly environment: IEnvironment,
    private readonly emailService: EmailService,
    private readonly timeoutService: TimeoutService
  ) {}

  ngOnInit(): void {}

  public async submit(): Promise<void> {
    this.state = "saving";

    try {
      await this.timeoutService.waitAtleast(500, this.emailService.send(this.name, this.email, this.message));
      this.state = "sent";
    } catch {
      this.state = "error";
    }
  }

  public reset(): void {
    this.state = "unsent";
  }
}

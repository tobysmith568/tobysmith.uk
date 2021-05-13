import { Component, Inject, OnInit } from "@angular/core";
import { EmailService } from "src/app/services/email/email.service";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  public name = "";
  public email = "";
  public message = "";

  public get isValid(): boolean {
    const validName = !!this.name && this.name.length > 0;
    const validEmail = !!this.email && !!this.email.match(/^\S+@\S+\.\S+$/);
    const validMessage = !!this.message && this.message.length > 0;

    return validName && validEmail && validMessage;
  }

  constructor(
    @Inject(ENVIRONMENT) public readonly environment: IEnvironment,
    private readonly emailService: EmailService
  ) {}

  ngOnInit(): void {}

  public async submit(): Promise<void> {
    this.emailService.send(this.name, this.email, this.message);
  }
}

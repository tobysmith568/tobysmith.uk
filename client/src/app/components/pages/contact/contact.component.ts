import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecaptchaComponent } from "ng-recaptcha";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {

  @ViewChild(RecaptchaComponent, { static: true })
  private recaptcha: RecaptchaComponent;

  public name: string;
  public email: string;
  public message: string;

  public errors: string[];

  public messageSent: boolean;

  constructor(private readonly httpClient: HttpClient) { }

  ngOnInit() {
  }

  public async onSubmit() {
    this.recaptcha.execute();
  }

  public async resolved(captchaResponse: string) {

    if (!captchaResponse) {
      this.errors = [
        "Unable to get reCAPTCHA response, please try again later or use another form of contact."
      ];
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      message: this.message,
      recaptcha: captchaResponse
    };

    await this.sendMessage(data);
  }

  private async sendMessage(body: any): Promise<boolean> {
    try {
      const result = await this.httpClient.post("https://api.tobysmith.uk/contact/", body, {
        headers: {
          "Content-Type": "application/json"
        },
        observe: "response",
        responseType: "text"
      }).toPromise();

      this.errors = [];
      this.messageSent = true;
      return true;
    } catch (e) {
      console.log(e);
      this.errors = JSON.parse(e.error).errors;
    }
  }
}

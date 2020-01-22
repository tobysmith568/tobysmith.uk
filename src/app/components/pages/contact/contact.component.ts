import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {

  public name: string;
  public email: string;
  public message: string;

  public errors: string[];

  public messageSent: boolean;

  constructor(private readonly httpClient: HttpClient) { }

  ngOnInit() {
  }

  public async onSubmit() {

    const data = {
      name: this.name,
      email: this.email,
      message: this.message
    };

    const result = await this.sendMessage(data);
  }

  private async sendMessage(body: any): Promise<boolean> {
    try {
      await this.httpClient.post("https://api.tobysmith.uk/contact/", body, {
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

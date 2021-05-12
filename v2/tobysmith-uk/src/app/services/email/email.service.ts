import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface SendResult {}

@Injectable({
  providedIn: "root"
})
export class EmailService {
  constructor(private readonly httpClient: HttpClient) {}

  public async send(name: string, email: string, message: string): Promise<void> {
    const sendResult = await this.httpClient
      .post<SendResult>("/api/send-email", { name, email, message })
      .toPromise();
  }
}

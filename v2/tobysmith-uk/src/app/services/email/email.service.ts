import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface SendResult {
  success: false;
}

@Injectable({
  providedIn: "root"
})
export class EmailService {
  constructor(private readonly httpClient: HttpClient) {}

  public async send(name: string, email: string, message: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const sendResult = await this.httpClient
          .post<SendResult>("/api/send-email", { name, email, message }, { observe: "response" })
          .toPromise();

        if (sendResult.ok && sendResult.body?.success) {
          resolve();
          return;
        }

        reject();
      } catch {
        reject();
      }
    });
  }
}

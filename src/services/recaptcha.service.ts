import { singleton } from "tsyringe";
import { EnvironmentService } from "./environment.service";
import { HttpService } from "./http.service";

interface Request {
  secret: string;
  response: string;
}

interface Response {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
}

@singleton()
export class RecaptchaService {
  constructor(private readonly environmentService: EnvironmentService, private readonly httpService: HttpService) {}

  public async verify(token: string): Promise<boolean> {
    const url = new URL("https://www.google.com/recaptcha/api/siteverify");
    url.searchParams.append("secret", this.environmentService.config.recaptcha.secret);
    url.searchParams.append("response", token);

    const result = await this.httpService.postJSON<Response>(url.href);
    return result.success;
  }
}

import { config } from "dotenv";
import { singleton } from "tsyringe";

config();

interface Redirect {
  key: string;
  url: string;
}

interface IConfig {
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    to: string;
  };
  recaptcha: {
    secret: string;
  };
  redirects: Redirect[];
  apiUrl: string;
}

@singleton()
export class EnvironmentService {
  private _config: IConfig;

  public get config(): IConfig {
    return this._config;
  }

  constructor() {
    const redirects: Redirect[] = [];

    for (const fullKey of Object.keys(process.env)) {
      if (fullKey.startsWith("REDIRECT_")) {
        const key = fullKey.substr(9).toLowerCase();
        const url = process.env[fullKey] ?? "https://tobysmith.uk";

        redirects.push({ key, url });
      }
    }

    this._config = Object.freeze({
      email: {
        host: process.env.EMAIL_HOST ?? "",
        port: this.parseNumber(process.env.EMAIL_PORT, 465),
        user: process.env.EMAIL_USER ?? "",
        pass: process.env.EMAIL_PASS ?? "",
        from: process.env.EMAIL_FROM ?? "",
        to: process.env.EMAIL_TO ?? ""
      },
      recaptcha: {
        secret: process.env.RECAPTCHA_SECRET ?? ""
      },
      redirects,
      apiUrl: process.env.API_URL ?? ""
    });
  }

  private parseNumber(value: string | undefined | null, fallback: number): number {
    const result = Number(value);

    return isNaN(result) ? fallback : result;
  }
}

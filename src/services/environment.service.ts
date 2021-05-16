import { config } from "dotenv";
import { singleton } from "tsyringe";

config();

interface IConfig {
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
    to: string;
  };
}

@singleton()
export class EnvironmentService {
  private _config: IConfig;

  public get config(): IConfig {
    return this._config;
  }

  constructor() {
    this._config = Object.freeze({
      email: {
        host: process.env.EMAIL_HOST ?? "",
        port: this.parseNumber(process.env.EMAIL_PORT, 465),
        user: process.env.EMAIL_USER ?? "",
        pass: process.env.EMAIL_PASS ?? "",
        from: process.env.EMAIL_FROM ?? "",
        to: process.env.EMAIL_TO ?? ""
      }
    });
  }

  private parseNumber(value: string | undefined | null, fallback: number): number {
    const result = Number(value);

    return isNaN(result) ? fallback : result;
  }
}

import { InjectionToken } from "@angular/core";

export const ENVIRONMENT = new InjectionToken<string>("Environment");

export interface IEnvironment {
  production: boolean;
  apiUrl: string;
  recaptchaPublicKey: string;
  disqusShortname: string;
  github: {
    username: string;
    url: string;
  };
  linkedin: {
    username: string;
    url: string;
  };
  facebook: {
    username: string;
    url: string;
  };
  email: string;
}

import { InjectionToken } from "@angular/core";

export const ENVIRONMENT = new InjectionToken<string>("Environment");

export interface IEnvironment {
  production: boolean;
  apiUrl: string;
}

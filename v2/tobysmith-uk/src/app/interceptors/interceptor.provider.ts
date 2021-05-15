import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Provider } from "@angular/core";
import { ProgressInterceptor } from "./progress/progress.interceptor";

export const interceptorProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ProgressInterceptor,
    multi: true
  }
];

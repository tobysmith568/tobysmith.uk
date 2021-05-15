import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ProgressService } from "src/app/services/progress/progress.service";

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  constructor(private readonly progressService: ProgressService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.progressService.start();

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          this.progressService.stop();
        }
        return event;
      })
    );
  }
}

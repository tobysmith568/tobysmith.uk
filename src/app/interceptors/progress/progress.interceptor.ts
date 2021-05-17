import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ProgressService } from "src/app/services/progress/progress.service";

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  constructor(private readonly progressService: ProgressService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.progressService.start();

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.progressService.stop();
        return throwError(error);
      }),
      map(event => {
        if (event instanceof HttpResponse) {
          this.progressService.stop();
        }
        return event;
      })
    );
  }
}

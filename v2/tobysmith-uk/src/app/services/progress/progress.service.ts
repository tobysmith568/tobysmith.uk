import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SsrService } from "../ssr/ssr.service";
import { map } from "rxjs/operators";

type ProgressActions = "start" | "stop";

@Injectable({
  providedIn: "root"
})
export class ProgressService {
  private subject: Subject<ProgressActions>;

  public get $(): Observable<ProgressActions> {
    return this.subject.asObservable();
  }

  constructor(private readonly ssrService: SsrService) {
    this.subject = new Subject();
  }

  public start(): void {
    if (!this.ssrService.isServerSide) {
      this.subject.next("start");
    }
  }

  public stop(): void {
    if (!this.ssrService.isServerSide) {
      this.subject.next("stop");
    }
  }
}

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  constructor(private readonly progressService: ProgressService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressService.start();

    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          this.progressService.stop();
        }
        return event;
      })
    );
  }
}

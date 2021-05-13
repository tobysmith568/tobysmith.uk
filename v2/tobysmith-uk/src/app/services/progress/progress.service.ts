import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SsrService } from "../ssr/ssr.service";

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

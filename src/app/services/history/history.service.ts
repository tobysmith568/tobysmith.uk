import { Injectable } from "@angular/core";
import { NavigationEnd, Router, Event } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HistoryService {
  private _previousPath: BehaviorSubject<string>;
  private currentPath?: string;

  public get $previousPath(): Observable<string> {
    return this._previousPath.asObservable();
  }

  constructor(router: Router) {
    this._previousPath = new BehaviorSubject<string>("../");

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (!!this.currentPath) {
          this._previousPath.next(this.currentPath);
        }

        this.currentPath = event.url;
      }
    });
  }
}

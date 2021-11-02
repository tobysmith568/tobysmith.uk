import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { HistoryService } from "src/app/services/history/history.service";

@Component({
  selector: "app-back-button",
  templateUrl: "./back-button.component.html",
  styleUrls: ["./back-button.component.scss"]
})
export class BackButtonComponent implements OnInit, OnDestroy {
  public previousPath?: string;
  private previousPathSubscription?: Subscription;

  constructor(private readonly historyService: HistoryService) {}

  ngOnInit(): void {
    this.previousPathSubscription = this.historyService.$previousPath.subscribe(path => {
      this.previousPath = path;
    });
  }

  ngOnDestroy(): void {
    this.previousPathSubscription?.unsubscribe();
  }
}

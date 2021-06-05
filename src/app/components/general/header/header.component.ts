import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { NgProgressComponent } from "ngx-progressbar";
import { ProgressService } from "src/app/services/progress/progress.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild(NgProgressComponent)
  public progressBar?: NgProgressComponent;

  @Output()
  public toggleMobileMenu: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly progresService: ProgressService) {}

  ngAfterViewInit(): void {
    this.progresService.$.subscribe(action => {
      switch (action) {
        case "start":
          this.progressBar?.start();
          return;
        case "stop":
          this.progressBar?.complete();
          return;
        default:
          console.error("Case not handled");
      }
    });
  }
}

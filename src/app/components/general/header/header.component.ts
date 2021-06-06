import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NgProgressComponent } from "ngx-progressbar";
import { ProgressService } from "src/app/services/progress/progress.service";
import { filter, map, mergeMap } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public mobileTitle = "";

  @ViewChild(NgProgressComponent)
  public progressBar?: NgProgressComponent;

  @Output()
  public toggleMobileMenu: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly router: Router, private readonly progresService: ProgressService) {}

  ngOnInit(): void {
    this.router.events.subscribe({
      next: event => {
        if (event instanceof NavigationEnd) {
          const { url } = event;
          const urlSegments = url.split("/");

          if (urlSegments.length < 2 || urlSegments[1] === "") {
            this.mobileTitle = "Toby Smith";
            return;
          }

          this.mobileTitle = urlSegments[1];
        }
      }
    });
  }

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

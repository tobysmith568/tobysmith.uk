import { Component, ViewChild, OnInit, ElementRef } from "@angular/core";
import { PerfectScrollbarComponent } from "ngx-perfect-scrollbar";
import { Router, NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  @ViewChild(PerfectScrollbarComponent, { static: true })
  public scrollbar: PerfectScrollbarComponent;

  @ViewChild("header", { static: true })
  private header: any;

  @ViewChild("mobileMenu", { static: true })
  private mobileMenu: ElementRef;

  public title = "tobysmith-uk";
  public mobileMenuIsOpen = false;

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.scrollbar.psScrollY.subscribe(() => {
      const distance = this.scrollbar.directiveRef.position(true).y;

      let position: number = this.header.header.nativeElement.scrollHeight;

      if (distance !== "start" && distance !== "end") {
        position -= distance - 20;
      }

      const formattedPosition = position + "px";

      this.mobileMenu.nativeElement.style.paddingTop = formattedPosition;
    }, null, null);

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.closeMobileMenu();
      this.scrollbar.directiveRef.scrollToTop();
    });
  }

  public toggleMobileMenu() {
    this.mobileMenuIsOpen = !this.mobileMenuIsOpen;
  }

  public closeMobileMenu() {
      this.mobileMenuIsOpen = false;
  }
}

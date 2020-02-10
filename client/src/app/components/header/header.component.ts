import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from "@angular/core";
import { PerfectScrollbarComponent } from "ngx-perfect-scrollbar";
import { mdiChevronDown, mdiForwardburger } from "@mdi/js";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {

  @Input()
  private scrollbar: PerfectScrollbarComponent;

  @Output()
  public menuToggled = new EventEmitter();

  @ViewChild("header", { static: true })
  private header: ElementRef;

  @ViewChild("projectDropdown", { static: true })
  private projectDropdown: ElementRef;

  @ViewChild("universityDropdown", { static: true })
  private universityDropdown: ElementRef;

  public downArrow = mdiChevronDown;
  public menuIcon = mdiForwardburger;

  constructor() { }

  ngOnInit() {
    this.scrollbar.psScrollY.subscribe(() => {
      const distance = this.scrollbar.directiveRef.position(true).y;

      let position: number = this.header.nativeElement.scrollHeight;

      if (distance !== "start" && distance !== "end") {
        position -= distance;
      }

      const formattedPosition = position + "px";

      this.projectDropdown.nativeElement.style.top = formattedPosition;
      this.universityDropdown.nativeElement.style.top = formattedPosition;
    }, null, null);
  }

  public toggleMobileMenu() {
    this.menuToggled.emit();
  }
}

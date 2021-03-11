import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { mdiOpenInNew } from "@mdi/js";

@Component({
  selector: "app-list-item",
  templateUrl: "./list-item.component.html",
  styleUrls: ["./list-item.component.scss"]
})
export class ListItemComponent implements OnInit {

  @ViewChild("link", { static: true })
  private link: ElementRef;

  @ViewChild("modal", { static: true })
  private modal: ElementRef;

  @Input()
  public icon: string;

  @Input()
  public header: string;

  @Input()
  public content: string;

  @Input()
  public href: string;

  public externalIcon = mdiOpenInNew;

  constructor() { }

  ngOnInit() {
    if (this.href !== undefined) {
      this.link.nativeElement.href = this.href;
    }
  }

  public click() {
    if (this.link.nativeElement.href === undefined || this.link.nativeElement.href.length === 0) {
      (this.modal as any).open();
    }
  }
}

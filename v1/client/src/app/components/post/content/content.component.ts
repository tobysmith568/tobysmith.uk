import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ContentComponent implements OnInit {

  @Input()
  public postContent: SafeHtml;

  constructor() { }

  ngOnInit() {
  }
}

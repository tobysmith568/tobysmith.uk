import { Component, Input } from "@angular/core";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-icon",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.scss"]
})
export class IconComponent {

  @Input()
  public icon: string;

  @Input()
  private width: string;

  constructor() { }

  public getWidth() {
    if (isNullOrUndefined(this.width)) {
      return "1.5rem";
    }

    return this.width;
  }
}

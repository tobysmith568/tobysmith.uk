import { Component, Input } from "@angular/core";

@Component({
  selector: "app-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
})
export class TagComponent {
  @Input()
  public label = "";

  @Input()
  public url = "";

  @Input()
  public iconUrl: string | undefined = "";

  public get external(): boolean | undefined {
    if (!this.url) {
      return undefined;
    }

    return this.url.startsWith("http");
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { IExternal } from "src/app/models/posts/sidebar/external.interface";
import { mdiOpenInNew } from "@mdi/js";

@Component({
  selector: "app-external",
  templateUrl: "./external.component.html",
  styleUrls: ["./external.component.scss"]
})
export class ExternalComponent implements OnInit {

  @Input()
  private external: IExternal;

  public externalIcon = mdiOpenInNew;

  constructor() { }

  ngOnInit() {
  }

  public getURL(): string {
    return this.external.url;
  }
}

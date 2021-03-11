import { Component, OnInit, Input } from "@angular/core";
import { IItch } from "src/app/models/posts/sidebar/itch.interface";

@Component({
  selector: "app-itch",
  templateUrl: "./itch.component.html",
  styleUrls: ["./itch.component.scss"]
})
export class ItchComponent implements OnInit {

  @Input()
  private itch: IItch;

  constructor() { }

  ngOnInit() {
  }

  public getURL(): string {
    return this.itch.url;
  }
}

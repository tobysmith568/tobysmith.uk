import { Component, OnInit, Input } from "@angular/core";
import { INuget } from "src/app/models/posts/sidebar/nuget.interface";

@Component({
  selector: "app-nuget",
  templateUrl: "./nuget.component.html",
  styleUrls: ["./nuget.component.scss"]
})
export class NugetComponent implements OnInit {

  @Input()
  private nuget: INuget;

  constructor() { }

  ngOnInit() {
  }

  public getURL(): string {
    return this.nuget.url;
  }
}

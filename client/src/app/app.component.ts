import { Component, ViewChild } from "@angular/core";
import { PerfectScrollbarComponent } from "ngx-perfect-scrollbar";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {

  @ViewChild(PerfectScrollbarComponent, { static: true })
  public scrollbar: PerfectScrollbarComponent;

  title = "tobysmith-uk";
}

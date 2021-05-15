import { Component, OnInit } from "@angular/core";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private readonly metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService
      .title("")
      .description(
        "Toby Smith is a London-based software developer who likes to focus on web-based technologies. This website is a place to see his work and read his thoughts"
      );
  }
}

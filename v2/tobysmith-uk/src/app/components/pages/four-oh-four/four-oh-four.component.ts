import { Component, OnInit } from "@angular/core";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-four-oh-four",
  templateUrl: "./four-oh-four.component.html",
  styleUrls: ["./four-oh-four.component.scss"]
})
export class FourOhFourComponent implements OnInit {
  constructor(private readonly metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.statusCode(404).title("404").description("Page not found!");
  }
}

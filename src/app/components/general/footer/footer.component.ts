import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  public year: string;

  constructor() {
    this.year = new Date().getFullYear().toString();
  }

  ngOnInit(): void {}
}

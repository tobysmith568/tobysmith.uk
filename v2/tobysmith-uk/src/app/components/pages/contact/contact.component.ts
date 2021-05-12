import { Component, Inject, OnInit } from "@angular/core";
import { ENVIRONMENT, IEnvironment } from "src/environments/environment.interface";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"]
})
export class ContactComponent implements OnInit {
  constructor(@Inject(ENVIRONMENT) public readonly environment: IEnvironment) {}

  ngOnInit(): void {}
}

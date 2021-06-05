import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"]
})
export class SideMenuComponent implements OnInit {
  @Input()
  public isOpen = false;

  constructor() {}

  ngOnInit(): void {}
}

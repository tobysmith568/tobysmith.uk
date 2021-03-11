import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public getAge(): number {
    const today = new Date();
    const month = today.getMonth() - 2;
    let age = today.getFullYear() - 1997;
    if (month < 0 || (month === 0 && today.getDate() < 2)) {
      age = age - 1;
    }

    return age;
  }
}

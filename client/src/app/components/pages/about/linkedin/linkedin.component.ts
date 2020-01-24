import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-linkedin",
  templateUrl: "./linkedin.component.html",
  styleUrls: ["./linkedin.component.scss"]
})
export class LinkedinComponent implements AfterViewInit {

  @ViewChild("linkedinScript", { static: true })
  private linkedinScript: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    const element = this.linkedinScript.nativeElement;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://platform.linkedin.com/badges/js/profile.js";

    if (element.innerHTML) {
      script.innerHTML = element.innerHTML;
    }

    element.parentElement.replaceChild(script, element);
  }
}

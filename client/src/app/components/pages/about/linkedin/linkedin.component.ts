import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-linkedin",
  templateUrl: "./linkedin.component.html",
  styleUrls: ["./linkedin.component.scss"]
})
export class LinkedinComponent implements OnInit {

  @ViewChild("linkedinScript", { static: true })
  private linkedinScript: ElementRef;

  constructor(private readonly httpClient: HttpClient) { }

  async ngOnInit() {
    const result = await this.httpClient.get("/api/li-widget", {
      observe: "body"
    }).toPromise() as any;

    const element = this.linkedinScript.nativeElement;
    const container = document.createElement("div");
    container.innerHTML = result;

    if (element.innerHTML) {
      container.innerHTML = element.innerHTML;
    }

    element.parentElement.replaceChild(container, element);
  }
}

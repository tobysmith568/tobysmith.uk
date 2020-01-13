import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NewTabService {

  constructor() { }

  public open(url: string, newTab: boolean = false) {
    if (newTab) {
      window.open(url, "_blank");
      return;
    }

    window.location.href = url;
  }
}

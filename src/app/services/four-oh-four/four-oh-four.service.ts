import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class FourOhFourService {
  constructor(private readonly router: Router) {}

  public GoTo404(): void {
    this.router.navigate(["404"], { skipLocationChange: true });
  }
}

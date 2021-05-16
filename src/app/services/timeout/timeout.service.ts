import { Injectable } from "@angular/core";
import { SsrService } from "../ssr/ssr.service";

@Injectable({
  providedIn: "root"
})
export class TimeoutService {
  constructor(private readonly ssrService: SsrService) {}

  public async waitAtleast<T>(milliseconds: number, promise: Promise<T>): Promise<T> {
    const delayPromise = this.sleep(milliseconds);

    const [result] = await Promise.all([promise, delayPromise]);
    return result;
  }

  public sleep(milliseconds: number): Promise<void> {
    if (this.ssrService.isServerSide) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { MetaService } from "src/app/services/meta/meta.service";
import { SsrService } from "src/app/services/ssr/ssr.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, OnDestroy {
  private currentPhrase = 0;
  private phrases = ["Full-stack developer", "TypeScript fanatic", "Burrito over-filler", "npm package author"];

  private timeout: NodeJS.Timeout | undefined;

  public get phrase(): string {
    return this.phrases[this.currentPhrase];
  }

  constructor(private readonly metaService: MetaService, private readonly ssrService: SsrService) {}

  ngOnInit(): void {
    this.metaService
      .title("")
      .description(
        "Toby Smith is a London-based software developer who likes to focus on web-based technologies. This website is a place to see his work and read his thoughts"
      );

    if (!this.ssrService.isServerSide) {
      setInterval(() => {
        const oldIndex = this.currentPhrase;

        const randMin = 0;
        const randMax = this.phrases.length - 1;

        while (this.currentPhrase === oldIndex) {
          this.currentPhrase = this.getRandomInt(randMin, randMax);
        }
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    if (!!this.timeout) {
      clearInterval(this.timeout);
    }
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

import { Component, OnInit } from "@angular/core";
import { About, AboutServiceGQL } from "src/app/services/api/about/about.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {
  public about?: About = undefined;

  constructor(private readonly aboutServiceGql: AboutServiceGQL, private readonly metaService: MetaService) {}

  async ngOnInit(): Promise<void> {
    const result = await this.aboutServiceGql.fetch().toPromise();
    this.about = result.data.abouts[0] ?? undefined;

    if (!!result?.data?.abouts[0]?.seo) {
      const { title, description, noIndex } = result.data.abouts[0].seo;
      this.metaService.title(title).description(description).noIndex(noIndex);
    }
  }
}

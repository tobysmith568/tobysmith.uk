import { Component, OnInit } from "@angular/core";
import { ProjectIndexPage, ProjectIndexService } from "src/app/services/api/projectIndex/project-index.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-all",
  templateUrl: "./all.component.html",
  styleUrls: ["./all.component.scss"]
})
export class AllComponent implements OnInit {
  public projectIndex?: ProjectIndexPage;

  constructor(private readonly projectIndexService: ProjectIndexService, private readonly metaService: MetaService) {}

  async ngOnInit(): Promise<void> {
    const result = await this.projectIndexService.fetch().toPromise();
    this.projectIndex = result.data.projectIndexPages?.[0] ?? undefined;

    if (!!this.projectIndex?.seo) {
      const { title, description, noIndex } = this.projectIndex.seo;
      this.metaService.title(title).description(description).noIndex(noIndex);
    }
  }
}

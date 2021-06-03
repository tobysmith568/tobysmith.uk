import { Component, OnInit } from "@angular/core";
import { Project, ProjectsServiceGQL } from "src/app/services/api/projects/projects.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnInit {
  public projects?: Project[] = [];

  constructor(private readonly projectsServiceGql: ProjectsServiceGQL, private readonly metaService: MetaService) {}

  async ngOnInit(): Promise<void> {
    const result = await this.projectsServiceGql.fetch().toPromise();
    this.projects = result.data.projects;

    if (!!result?.data?.seo) {
      const { title, description } = result.data.seo;
      this.metaService.title(title).description(description);
    }
  }
}

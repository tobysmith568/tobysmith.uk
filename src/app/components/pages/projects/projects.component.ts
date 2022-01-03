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
    const projectPage = result.data.projectPages[0];

    this.projects = projectPage?.projects;

    if (!!projectPage?.seo) {
      const { title, description, noIndex } = projectPage.seo;
      this.metaService.title(title).description(description).noIndex(noIndex);
    }
  }
}

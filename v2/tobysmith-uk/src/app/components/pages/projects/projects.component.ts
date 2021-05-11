import { Component, OnInit } from "@angular/core";
import { Project, ProjectsServiceGQL } from "src/app/services/api/projects/projects.service";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnInit {
  public projects?: Project[] = [];

  constructor(private readonly projectsServiceGql: ProjectsServiceGQL) {}

  async ngOnInit(): Promise<void> {
    const result = await this.projectsServiceGql.fetch().toPromise();
    this.projects = result.data.projects;
  }
}

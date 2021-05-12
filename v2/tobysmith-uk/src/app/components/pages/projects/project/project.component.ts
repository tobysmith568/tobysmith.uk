import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Project, ProjectServiceGQL } from "src/app/services/api/project/project.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {
  public project?: Project;

  constructor(private readonly route: ActivatedRoute, private readonly projectServiceGql: ProjectServiceGQL) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const slug = params.get("slug") ?? undefined;

      if (!slug) {
        return;
      }

      const result = await this.projectServiceGql.fetch({ slug }).toPromise();
      this.project = result.data.project;
    });
  }
}

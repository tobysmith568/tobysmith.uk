import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Project, ProjectServiceGQL } from "src/app/services/api/project/project.service";
import { FourOhFourService } from "src/app/services/four-oh-four/four-oh-four.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit, OnDestroy {
  private paramMapSubscription?: Subscription;

  public project?: Project;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly projectServiceGql: ProjectServiceGQL,
    private readonly metaService: MetaService,
    private readonly fourOhFourService: FourOhFourService
  ) {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe(async (params: ParamMap) => {
      const slug = params.get("slug") ?? undefined;

      if (!slug) {
        this.fourOhFourService.GoTo404();
        return;
      }

      const result = await this.projectServiceGql.fetch({ slug }).toPromise();

      if (!result.data.project) {
        this.fourOhFourService.GoTo404();
        return;
      }

      this.project = result.data.project;

      if (!!result.data?.project?.seo) {
        const { title, description, noIndex } = result.data.project.seo;
        this.metaService.title(title).description(description).noIndex(noIndex);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
  }
}

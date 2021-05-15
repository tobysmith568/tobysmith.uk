import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Post, PostServiceGQL } from "src/app/services/api/post/post.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit, OnDestroy {
  private paramMapSubscription?: Subscription;

  public post?: Post;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postServiceGql: PostServiceGQL,
    private readonly metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.paramMapSubscription = this.route.paramMap.subscribe(async (params: ParamMap) => {
      const slug = params.get("slug") ?? undefined;

      if (!slug) {
        return;
      }

      const result = await this.postServiceGql.fetch({ slug }).toPromise();
      this.post = result.data.post;

      if (!!result.data.post.seo) {
        const { title, description } = result.data.post.seo;
        this.metaService.title(title).description(description);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
  }
}

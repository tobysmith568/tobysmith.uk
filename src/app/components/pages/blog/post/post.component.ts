import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Post, PostServiceGQL } from "src/app/services/api/post/post.service";
import { FourOhFourService } from "src/app/services/four-oh-four/four-oh-four.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit, OnDestroy {
  private paramMapSubscription?: Subscription;

  public slug?: string;
  public post?: Post;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postServiceGql: PostServiceGQL,
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

      const result = await this.postServiceGql.fetch({ slug }).toPromise();

      if (!result.data.post) {
        this.fourOhFourService.GoTo404();
        return;
      }

      this.post = result.data.post;
      this.slug = slug;

      if (!!result?.data?.post?.seo) {
        const { title, description, noIndex } = result.data.post.seo;
        this.metaService.title(title).description(description).noIndex(noIndex);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
  }
}

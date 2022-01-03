import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Post, PostsServiceGQL } from "src/app/services/api/posts/posts.service";
import { SearchServiceGQL } from "src/app/services/api/search/search.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"]
})
export class BlogComponent implements OnInit, OnDestroy {
  private paramMapSubscription?: Subscription;

  public searchTerm?: string;
  public posts?: Post[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsServiceGql: PostsServiceGQL,
    private readonly searchServiceGql: SearchServiceGQL,
    private readonly metaService: MetaService
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramMapSubscription = this.route.paramMap.subscribe(paramMap => this.onParamMapChange(paramMap));
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
  }

  private async onParamMapChange(paramMap: ParamMap): Promise<void> {
    this.searchTerm = paramMap.get("term") ?? undefined;

    if (!!this.searchTerm) {
      this.search(this.searchTerm);
      return;
    }

    await this.getAllPosts();
  }

  private async search(term: string): Promise<void> {
    const result = await this.searchServiceGql.fetch({ term }).toPromise();
    this.posts = result.data.posts;

    this.metaService.title("Search results").description(`Search results for "${term}"`).noIndex(true);
  }

  private async getAllPosts(): Promise<void> {
    const result = await this.postsServiceGql.fetch().toPromise();
    this.posts = result.data.posts;

    const seo = result.data.postPages[0].seo;
    if (!!seo) {
      this.metaService.title(seo.title).description(seo.description).noIndex(seo.noIndex);
    }
  }
}

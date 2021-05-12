import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Post, PostsServiceGQL } from "src/app/services/api/posts/posts.service";
import { SearchServiceGQL } from "src/app/services/api/search/search.service";

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
    private readonly searchServiceGql: SearchServiceGQL
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramMapSubscription = this.route.paramMap.subscribe(async paramMap => {
      this.searchTerm = paramMap.get("term") ?? undefined;

      if (!!this.searchTerm) {
        const searchResult = await this.searchServiceGql.fetch({ term: this.searchTerm }).toPromise();
        this.posts = searchResult.data.posts;
        return;
      }

      const result = await this.postsServiceGql.fetch().toPromise();
      this.posts = result.data.posts;
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
  }
}

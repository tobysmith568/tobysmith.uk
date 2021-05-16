import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router, Event, ActivatedRoute, RoutesRecognized, ActivationEnd } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit, OnDestroy {
  private readonly blogURL = "/blog";
  private readonly blogSearchURL = "/blog/search/";

  private paramMapSubscription?: Subscription;

  public onBlog = false;
  public onBlogSearch = false;

  public searchTerm = "";

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.searchTerm = event.snapshot.paramMap.get("term") ?? "";
      }

      if (event instanceof NavigationEnd) {
        this.onBlog = event.url.startsWith(this.blogURL);
        this.onBlogSearch = event.url.startsWith(this.blogSearchURL);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramMapSubscription?.unsubscribe();
  }

  public async search(): Promise<void> {
    if (!this.searchTerm || this.searchTerm.length === 0) {
      await this.router.navigate(["blog"]);
      return;
    }

    await this.router.navigate(["blog", "search", this.searchTerm]);
  }
}

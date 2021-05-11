import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router, Event } from "@angular/router";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  private readonly blogURL = "/blog";
  private readonly blogSearchURL = "/blog/search/";

  public onBlog = false;
  public onBlogSearch = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event: Event) => {
        if (!(event instanceof NavigationEnd)) {
          return;
        }

        this.onBlog = event.url.startsWith(this.blogURL);
        this.onBlogSearch = event.url.startsWith(this.blogSearchURL);
      }
    });
  }

  public async search(term: string): Promise<void> {
    await this.router.navigate(["blog", "search", term]);
  }
}

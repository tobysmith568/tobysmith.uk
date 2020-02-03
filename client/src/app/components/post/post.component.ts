import { Component, OnInit, SecurityContext } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PostService } from "src/app/services/posts/post.service";
import { IPost } from "src/app/models/posts/post.interface";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {

  public post: IPost;
  private postContent: SafeHtml;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly postService: PostService,
              private readonly httpClient: HttpClient,
              private readonly sanitizer: DomSanitizer,
              private readonly router: Router) { }

  async ngOnInit() {
    this.post = this.postService.getPost(this.activatedRoute.snapshot.paramMap.get("slug"));

    if (!this.post) {
      this.goTo404();
    }

    try {
      const result = await this.httpClient.get("./assets/generated-posts/" + this.post.contentPath + ".html", {
        responseType: "text"
      }).toPromise();

      this.postContent = this.sanitizer.sanitize(SecurityContext.HTML, result);
    } catch (e) {
      this.goTo404();
    }
  }

  public getPostContent() {
    return this.postContent;
  }

  public hasSidebarContent(): boolean {
    return !(!this.post.github && !this.post.itch && !this.post.skill && !this.post.downloads);
  }

  private goTo404() {
    this.router.navigate([ "404" ], {
      skipLocationChange: true
    });
  }
}

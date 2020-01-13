import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PostService } from "src/app/services/posts/post.service";
import { IPost } from "src/app/models/posts/post";
import { SafeHtml } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { MarkdownService } from "src/app/services/markdown/markdown.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PostComponent implements OnInit {

  public post: IPost;
  public postContent: SafeHtml;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly postService: PostService,
              private readonly markdownService: MarkdownService,
              private readonly httpClient: HttpClient) { }

  async ngOnInit() {
    this.post = this.postService.getPost(this.activatedRoute.snapshot.paramMap.get("slug"));

    try {
      const result = await this.httpClient.get("./assets/posts/" + this.post.contentPath, {
        responseType: "text"
      }).toPromise();

      this.postContent = this.markdownService.toSafeHTML(result);
    } catch (e) {
      this.postContent = "<p>This post could not be found!<p>";
    }
  }
}

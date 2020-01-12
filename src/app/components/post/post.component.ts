import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PostService } from "src/app/services/posts/post.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly postService: PostService) { }

  ngOnInit() {
  }

  public getPostDetails(): string {
    for (const post of this.postService.getPosts()) {
      if (post.slug === this.activatedRoute.snapshot.paramMap.get("slug")) {
        return JSON.stringify(post);
      }
    }
  }
}

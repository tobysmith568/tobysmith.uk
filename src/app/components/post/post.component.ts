import { Component, OnInit } from "@angular/core";
import { PostConfig } from "src/app/postConfig";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  public getPostDetails(): string {
    for (const post of PostConfig.posts) {
      if (post.slug === this.activatedRoute.snapshot.paramMap.get("slug")) {
        return JSON.stringify(post);
      }
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IPost } from "src/app/posts/post";
import { PostConfig } from "src/app/postConfig";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {

  public posts: IPost[];

  constructor(private readonly router: Router) { }

  ngOnInit() {
    this.posts = [];

    for (const post of PostConfig.posts) {
      for (const category of post.categories) {
        if (("/" + category).startsWith(this.router.url)) {
          this.posts.push(post);
          break;
        }
      }
    }
  }
}

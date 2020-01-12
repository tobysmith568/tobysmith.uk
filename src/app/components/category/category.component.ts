import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IPost } from "src/app/models/posts/post";
import { PostService } from "src/app/services/posts/post.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {

  public posts: IPost[];

  constructor(private readonly router: Router,
              private readonly postService: PostService) { }

  ngOnInit() {
    this.posts = [];

    for (const post of this.postService.getPosts()) {
      for (const category of post.categories) {
        if (("/" + category).startsWith(this.router.url)) {
          this.posts.push(post);
          break;
        }
      }
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IPost } from "src/app/models/posts/post.interface";
import { PostService } from "src/app/services/posts/post.service";
import { CategoryService } from "src/app/services/categories/category.service";
import { ICategory } from "src/app/models/posts/category.interface";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {

  public posts: IPost[];
  public category: ICategory;

  constructor(private readonly router: Router,
              private readonly postService: PostService,
              private readonly categoryService: CategoryService) { }

  ngOnInit() {
    this.posts = this.postService.getPostsInCategory(this.router.url);
    this.category = this.categoryService.getCategory(this.router.url);
  }
}

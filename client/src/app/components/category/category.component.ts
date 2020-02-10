import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Post } from "src/app/models/posts/post.interface";
import { PostService } from "src/app/services/posts/post.service";
import { CategoryService } from "src/app/services/categories/category.service";
import { ICategory } from "src/app/models/posts/category.interface";
import { isNullOrUndefined } from "util";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {

  public posts: Post[];
  public name: string;
  public description: string;

  constructor(private readonly router: Router,
              private readonly postService: PostService,
              private readonly categoryService: CategoryService,
              private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.isTag) {
      let tagName = this.activatedRoute.snapshot.url.slice(-1)[0].path;
      tagName = tagName.replace(" ", "-").toLowerCase();

      this.getContentForTag(tagName);
    } else {
      this.getContentForCategory(this.router.url);
    }
  }

  private getContentForTag(tagName: string): void {
    const tag = this.categoryService.getTag(tagName);

    if (isNullOrUndefined(tag)) {
      this.posts = this.postService.getPostsWithTagName(tagName);
    } else {
      this.posts = this.postService.getPostsWithTag(tag);
    }

    if (isNullOrUndefined(this.posts) || this.posts.length === 0) {
      this.name = `No posts could be found with the tag "${tagName}"`;
      return;
    }

    this.name = tag.displayName || tag.name;
    this.description = tag.description;
  }

  private getContentForCategory(categoryName: string): void {
    const category = this.categoryService.getCategory(categoryName);

    if (!isNullOrUndefined(category)) {
      this.name = category.displayName || category.slug;
      this.description = category.description;
    }

    this.posts = this.postService.getPostsInCategory(categoryName);

    if (isNullOrUndefined(this.posts) || this.posts.length === 0) {
      this.name = `No posts could be found in the category "${categoryName}"`;
      return;
    }
  }
}

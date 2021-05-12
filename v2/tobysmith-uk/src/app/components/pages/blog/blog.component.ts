import { Component, OnInit } from "@angular/core";
import { Post, PostsServiceGQL } from "src/app/services/api/posts/posts.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"]
})
export class BlogComponent implements OnInit {
  public posts?: Post[] = [];

  constructor(private readonly postsServiceGql: PostsServiceGQL) {}

  async ngOnInit(): Promise<void> {
    const result = await this.postsServiceGql.fetch().toPromise();
    this.posts = result.data.posts;
  }
}

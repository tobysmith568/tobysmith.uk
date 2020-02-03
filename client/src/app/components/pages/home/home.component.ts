import { Component, OnInit } from "@angular/core";
import { PostService } from "src/app/services/posts/post.service";
import { IPost } from "src/app/models/posts/post.interface";
import { IRepository } from "src/app/models/github/repository.interface";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  public projects: IPost[];
  public university: IPost[];
  public favourites: IPost[];

  public repositories: IRepository[];

  constructor(private readonly postService: PostService) {
    this.repositories = [
      {
        name: "This is a name",
        description: "This is a description",
        url: "https://github.com/tobysmith568/something"
      },
      {
        name: "This is also a name",
        description: "This is also a description",
        url: "https://github.com/tobysmith568/also-something"
      }
    ] as IRepository[];
  }

  ngOnInit() {
    this.projects = this.postService.getPostsInCategory("/projects", 3);
    this.university = this.postService.getPostsInCategory("/university", 3);
    this.favourites = this.postService.getPostsInCategory("/favourites", 3);
  }

}

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

  public featuredTags = [
    {
      name: "csharp",
      displayName: "C#",
      icon: "assets/img/csharp.png"
    },
    {
      name: "typescript",
      displayName: "TypeScript",
      icon: "assets/img/typescript.png"
    },
    {
      name: "java",
      displayName: "Java",
      icon: "assets/img/java.png"
    },
    {
      name: "alexa",
      displayName: "Alexa",
      icon: "assets/img/alexa.png"
    }
  ];

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
    this.projects = this.postService.getPostsInCategory("/projects", 1);
    this.university = this.postService.getPostsInCategory("/university", 1);
    this.favourites = this.postService.getPostsInCategory("/favourites", 3);
  }

}

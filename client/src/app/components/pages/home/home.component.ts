import { Component, OnInit } from "@angular/core";
import { PostService } from "src/app/services/posts/post.service";
import { IPost } from "src/app/models/posts/post.interface";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  public project: IPost;
  public university: IPost;

  constructor(private readonly postService: PostService) { }

  ngOnInit() {
    const personalProjects = this.postService.getPostsInCategory("/projects", 1);

    if (personalProjects.length > 0) {
      this.project = personalProjects[0];
    }

    const universityProjects = this.postService.getPostsInCategory("/university", 1);

    if (universityProjects.length > 0) {
      this.university = universityProjects[0];
    }
  }

}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post, PostServiceGQL } from "src/app/services/api/post/post.service";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {
  public post?: Post;

  constructor(private readonly route: ActivatedRoute, private readonly postServiceGql: PostServiceGQL) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const slug = params.get("slug") ?? undefined;

      if (!slug) {
        return;
      }

      const result = await this.postServiceGql.fetch({ slug }).toPromise();
      this.post = result.data.post;
    });
  }
}

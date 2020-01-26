import { Component, OnInit, Input } from "@angular/core";
import { IPost } from "src/app/models/posts/post.interface";

@Component({
  selector: "app-small-post",
  templateUrl: "./small-post.component.html",
  styleUrls: ["./small-post.component.scss"]
})
export class SmallPostComponent implements OnInit {

  @Input()
  public post: IPost;

  constructor() { }

  ngOnInit() {
  }

}

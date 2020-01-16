import { Component, OnInit, Input } from "@angular/core";
import { IPost } from "src/app/models/posts/post.interface";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {

  @Input()
  private post: IPost;

  constructor() { }

  ngOnInit() {
  }
}

import { Component, OnInit, Input } from "@angular/core";
import { IPost } from "src/app/posts/post";

@Component({
  selector: "app-category-item",
  templateUrl: "./category-item.component.html",
  styleUrls: ["./category-item.component.scss"]
})
export class CategoryItemComponent implements OnInit {

  @Input()
  public post: IPost;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from "@angular/core";
import { IPost } from "src/app/models/posts/post.interface";
import { Router, ActivatedRoute } from "@angular/router";
import { NewTabService } from "src/app/services/new-tab/new-tab.service";

@Component({
  selector: "app-category-item",
  templateUrl: "./category-item.component.html",
  styleUrls: ["./category-item.component.scss"]
})
export class CategoryItemComponent implements OnInit {

  @Input()
  public post: IPost;

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly newTabService: NewTabService) { }

  ngOnInit() {
  }

  public navigate() {
    if (this.post.externalLink) {
      this.newTabService.open(this.post.externalLink, true);
    } else {
      this.router.navigate([ this.post.slug ], {
        relativeTo: this.activatedRoute
      });
    }
  }
}

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

  private static readonly monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  @Input()
  private post: IPost;

  constructor(private readonly router: Router,
              private readonly activatedRoute: ActivatedRoute,
              private readonly newTabService: NewTabService) { }

  ngOnInit() {
  }

  public navigate() {
    if (this.post.internalLink && !this.post.internalLink.isRelative) {
      this.router.navigate([ this.post.internalLink.url ]);
    } else if (this.post.internalLink && this.post.internalLink.isRelative) {
      this.router.navigate([ this.post.internalLink.url ], { relativeTo: this.activatedRoute });
    } else if (this.post.externalLink) {
      this.newTabService.open(this.post.externalLink, true);
    } else {
      this.router.navigate([ this.post.slug ], {
        relativeTo: this.activatedRoute
      });
    }
  }

  public getTitle(): string {
    return this.post.title;
  }

  public getPreviewImage(): string {
    return this.post.previewImage;
  }

  public getPreview(): string {
    return this.post.preview;
  }

  public getDate(): string {
    const day = this.post.date.getDate();
    const monthIndex = this.post.date.getMonth();
    const year = this.post.date.getFullYear();

    if (day % 10 === 1) {
      return day + "st " + CategoryItemComponent.monthNames[monthIndex] + " " + year;
    }

    if (day % 10 === 2) {
      return day + "nd " + CategoryItemComponent.monthNames[monthIndex] + " " + year;
    }

    if (day === 3) {
      return day + "rd " + CategoryItemComponent.monthNames[monthIndex] + " " + year;
    }

    return day + "th " + CategoryItemComponent.monthNames[monthIndex] + " " + year;
  }
}

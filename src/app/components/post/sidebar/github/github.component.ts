import { Component, OnInit, Input } from "@angular/core";
import { IGithub } from "src/app/models/posts/sidebar/github.interface";

@Component({
  selector: "app-github",
  templateUrl: "./github.component.html",
  styleUrls: ["./github.component.scss"]
})
export class GithubComponent implements OnInit {

  @Input()
  private github: IGithub;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from "@angular/core";
import { IPost } from "src/app/models/posts/post.interface";
import { ISkill } from "src/app/models/posts/sidebar/skill";
import { IItch } from "src/app/models/posts/sidebar/itch.interface";
import { IGithub } from "src/app/models/posts/sidebar/github.interface";
import { IDownload } from "src/app/models/posts/sidebar/download.interface";
import { IExternal } from "src/app/models/posts/sidebar/external.interface";
import { INuget } from "src/app/models/posts/sidebar/nuget.interface";

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

  public getSkill(): ISkill {
    return this.post.skill;
  }

  public getItch(): IItch {
    return this.post.itch;
  }

  public getGithub(): IGithub {
    return this.post.github;
  }

  public getDownloads(): IDownload[] {
    return this.post.downloads;
  }

  public getExternal(): IExternal {
    return this.post.external;
  }

  public getNuget(): INuget {
    return this.post.nuget;
  }
}

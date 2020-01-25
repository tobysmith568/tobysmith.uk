import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-githubwidget",
  templateUrl: "./github.component.html",
  styleUrls: ["./github.component.scss"]
})
export class GithubComponent implements OnInit {

  public avatarUrl: string;
  public name: string;
  public htmlUrl: string;
  public bio: string;
  public publicRepoUrl: string;
  public publicRepoCount: string;
  public gistUrl: string;
  public gistCount: string;

  constructor(private readonly httpClient: HttpClient) { }

  async ngOnInit() {
    const result = await this.httpClient.get("https://api.github.com/users/tobysmith568", {
      observe: "body"
    }).toPromise() as any;

    console.log(result);

    this.avatarUrl = result.avatar_url;
    this.name = result.name;
    this.htmlUrl = result.html_url;
    this.bio = result.bio;
    this.publicRepoUrl = result.html_url + "?tab=repositories";
    this.publicRepoCount = result.public_repos + " public repositories";
    this.gistUrl = "https://gist.github.com/" + result.login;
    this.gistCount = result.public_gists + " public gists";
  }

}

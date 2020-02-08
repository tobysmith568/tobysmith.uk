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
  public contributions: string;
  public organizations: any;

  constructor(private readonly httpClient: HttpClient) { }

  async ngOnInit() {
    const result = await this.httpClient.get("/api/gh-widget", {
      observe: "body"
    }).toPromise() as any;

    console.log(result);

    this.avatarUrl = result.avatarUrl;
    this.name = result.name;
    this.htmlUrl = result.url;
    this.bio = result.bio;
    this.publicRepoUrl = result.url + "?tab=repositories";
    this.publicRepoCount = result.repoCount + " public repositories";
    this.contributions = result.contributionCount + " contributions in the last year";
    this.organizations = result.organizations;
  }
}

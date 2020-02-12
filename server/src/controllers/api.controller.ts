import { Request, Response } from "express";
import { IRepository } from "../models/github-repo-request/repository.interface";
import { ILanguage } from "../models/github-repo-request/language.interface";
import { GithubGraphQLService } from "../services/github-graphql.service";
import { isNullOrUndefined } from "util";
import { IUser } from "../models/github-widget-request/user.interface";
import { IOrganization } from "../models/github-widget-request/organization.interface";
import { HttpService } from "../services/http.service";
const unescapeJs = require("unescape-js");

export class APIController {

  private static lastRepoResponse: IRepository[];
  private static lastGithubWidgetResponse: IUser;
  private static lastLinkedWidgetResponse: string;

  private static readonly reposRequest = `{
    user(login: "tobysmith568") {
      repositories(orderBy: { field: PUSHED_AT, direction: DESC }, first: 3, privacy: PUBLIC) {
        nodes {
          name
          languages(first: 3, orderBy: { field: SIZE, direction: DESC}) {
            nodes {
              name
              color
            }
          }
          description,
          url,
          updatedAt,
          stargazers {
            totalCount
          }
        }
      }
    }
  }`;

  private static readonly widgetRequest = `{
    user(login: "tobysmith568") {
      login
      avatarUrl
      name
      bio
      url
      repoCount: repositories(privacy: PUBLIC) {
        totalCount
      }
      gists(privacy: PUBLIC) {
        totalCount
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
      }
      organizations(first: 5) {
        nodes {
          avatarUrl
          url
          name
        }
      }
    }
  }`;

  private static linkedinUrl = "https://badges.linkedin.com/profile?locale=en_US&badgetype=vertical&badgetheme=dark&uid=510212&version=v1&maxsize=medium&trk=profile-badge&vanityname=tobysmith568";

  constructor(private readonly githubGraphQLService: GithubGraphQLService,
              private readonly httpService: HttpService) {}

  public repos = async (req: Request, res: Response) => {
    
    const data = await this.githubGraphQLService.get(APIController.reposRequest);

    if (!isNullOrUndefined(data)) {
      APIController.lastRepoResponse = this.mapRepoResponse(data);
    }

    res.json(APIController.lastRepoResponse);
  }

  public githubWidget = async (req: Request, res: Response) => {
    
    const data = await this.githubGraphQLService.get(APIController.widgetRequest);

    if (!isNullOrUndefined(data)) {
      APIController.lastGithubWidgetResponse = this.mapWidgetResponse(data);
    }

    res.json(APIController.lastGithubWidgetResponse);
  }

  public linkedinWidget = async (req: Request, res: Response) => {
    const data = await this.httpService.get(APIController.linkedinUrl);

    if (!isNullOrUndefined(data)) {

      const unexcaped: string = unescapeJs(data);
      const tagsOnly = unexcaped.substring(17, unexcaped.lastIndexOf("\""));

      APIController.lastLinkedWidgetResponse = tagsOnly;
    }

    res.send(APIController.lastLinkedWidgetResponse);
  }

  private mapRepoResponse(response: any): IRepository[] {
    const results: IRepository[] = [];

    for (const repo of response.data.user.repositories.nodes) {
      const repository: IRepository = {
        description: repo.description,
        languages: this.mapRepoLanguages(repo.languages.nodes),
        name: repo.name,
        stargazers: repo.stargazers.totalCount,
        updatedAt: repo.updatedAt,
        url: repo.url
      };

      results.push(repository);
    }

    return results;
  }

  private mapRepoLanguages(languages: any): ILanguage[] {
    const results: ILanguage[] = [];

    for (const language of languages) {
      const result: ILanguage = {
        colour: language.color,
        name: language.name
      };

      results.push(result);
    }

    return results;
  }

  private mapWidgetResponse(response: any): IUser {
    const data = response.data.user;

    const result: IUser = {
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      contributionCount: data.contributionsCollection.contributionCalendar.totalContributions,
      gistCount: data.gists.totalCount,
      login: data.login,
      name: data.name,
      organizations: this.mapWidgetOrganizations(data.organizations.nodes),
      repoCount: data.repoCount.totalCount,
      url: data.url
    };

    return result;
  }

  private mapWidgetOrganizations(organizations: any[]): IOrganization[] {
    const results: IOrganization[] = [];

    for (const org of organizations) {
      results.push({
        avatarUrl: org.avatarUrl,
        name: org.name,
        url: org.url
      });
    }

    return results;
  }
}

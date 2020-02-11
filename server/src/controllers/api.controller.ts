import { Request, Response } from "express";
import { IRepository } from "../models/github-repo-request/repository.interface";
import { ILanguage } from "../models/github-repo-request/language.interface";
import { GithubGraphQLService } from "../services/github-graphql.service";
import { isNullOrUndefined } from "util";
import { IUser } from "../models/github-widget-request/user.interface";
import { IOrganization } from "../models/github-widget-request/organization.interface";

export class APIController {

  private static lastRepoResponse: IRepository[];
  private static lastWidgetResponse: IUser;

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

  constructor(private readonly githubGraphQLService: GithubGraphQLService) {}

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
      APIController.lastWidgetResponse = this.mapWidgetResponse(data);
    }

    res.json(APIController.lastWidgetResponse);
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

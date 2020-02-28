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
  
  private static readonly defaultLinkedWidgetResponse = `<div class="LI-profile-badge" data-version="v1" data-size="medium" data-locale="en_US" data-type="vertical" data-theme="dark" data-vanity="tobysmith568" data-rendered="true" data-uid="654123"><a class="LI-simple-link" href="https://uk.linkedin.com/in/tobysmith568?trk=profile-badge">Toby Smith</a><div><script src="https://static-exp1.licdn.com/sc/h/3qk7aqkysw7gz575y2ma1e5ky" type="text/javascript"></script><code id="__pageContext__" style="display: none;"></code><script src="https://static-exp1.licdn.com/sc/p/com.linkedin.badger-frontend%3Abadger-frontend-static-content%2B0.1.132/f/%2Fbadger-frontend%2Fsc-hashes%2Fsc-hashes_en_US.js"></script><script src="https://static-exp1.licdn.com/sc/h/19dd5wwuyhbk7uttxpuelttdg"></script><link rel="stylesheet" href="https://static-exp1.licdn.com/sc/h/cfzfb7mbaaxnxarmlhhyn5t8p"><div dir="ltr" class="LI-badge-container-vertical-dark LI-badge-container vertical dark medium" style="display: none"> <div class="LI-profile-badge-header LI-name-container"><div class="LI-col"><div class="LI-profile-pic-container" style="background-image: url(https://static-exp1.licdn.com/sc/h/856xpihrituhwdjrua9z5u5na);"><img src="https://media-exp1.licdn.com/dms/image/C4D03AQFez08sp3Q3NQ/profile-displayphoto-shrink_200_200/0?e=1586995200&amp;v=beta&amp;t=roBTZSr7Chg0pMASy5Z4yS7owLT9E8AE6Frf_SESIJU" class="LI-profile-pic" alt="Toby Smith"></div></div><div class="LI-col LI-header"><div class="LI-name"><a href="https://uk.linkedin.com/in/tobysmith568?trk=profile-badge-name">Toby Smith</a></div><div class="LI-title">Final year Computing student at Plymouth University</div></div></div><ul class="more-info"><li class="LI-field"><a href="https://www.linkedin.com/company/pcms-group?trk=profile-badge-company">PCMS Group</a></li></ul><div class="LI-profile-badge-footer"><a href="https://uk.linkedin.com/in/tobysmith568?trk=profile-badge-cta" class="LI-view-profile">View profile</a><span class="LI-logo"><img src="https://static-exp1.licdn.com/scds/common/u/images/logos/linkedin/logo_linkedin_flat_white_93x21.png" alt="LinkedIn" class="LI-icon"></span></div></div></div></div>`;
  private static readonly linkedinUrl = "https://badges.linkedin.com/profile?locale=en_US&badgetype=vertical&badgetheme=dark&uid=510212&version=v1&maxsize=medium&trk=profile-badge&vanityname=tobysmith568";
  
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

  constructor(private readonly githubGraphQLService: GithubGraphQLService,
              private readonly httpService: HttpService) {
    APIController.lastLinkedWidgetResponse = APIController.defaultLinkedWidgetResponse;
  }

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

    res.json({ payload: APIController.lastLinkedWidgetResponse });
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

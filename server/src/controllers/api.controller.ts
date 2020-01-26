import { default as axios } from "axios";
import { Request, Response } from "express";
import { IRepository } from "../models/github/repository.interface";
import { ILanguage } from "../models/github/language.interface";
import { Config } from "../config/config";

export class APIController {

  private static lastRepoResponse: IRepository[];

  constructor(private readonly config: Config) {}

  public repos = async (req: Request, res: Response) => {
    try {
      const response = await axios.post("https://api.github.com/graphql", {
        query : `{
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
        }`
      }, {
        headers: {
          Authorization: "Bearer " + this.config.getGithubAccessToken()
        }
      });

      APIController.lastRepoResponse = this.mapRepoResponse(response.data);
    } catch (e) {
    }

    res.json(APIController.lastRepoResponse);
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
}

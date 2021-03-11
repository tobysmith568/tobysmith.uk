import { default as axios } from "axios";
import { Config } from "../config/config";

export class GithubGraphQLService {

  private static readonly apiLocation = "https://api.github.com/graphql";

  constructor(private readonly config: Config) { }

  public async get(request: string): Promise<object | undefined> {
    try {
      const response = await axios.post(GithubGraphQLService.apiLocation, {
        query : request
      }, {
        headers: {
          Authorization: "Bearer " + this.config.getGithubAccessToken()
        }
      });

      return response.data;
    } catch (e) {
      return undefined;
    }
  }
}

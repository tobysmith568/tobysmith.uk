export class Config {

  private readonly redirects: Map<string, string>;
  private readonly githubAccessToken: string;

  constructor() {

    this.redirects = new Map();

    for (const envvar in process.env) {
      if (Object.prototype.hasOwnProperty.call(process.env, envvar)) {
        if (envvar.startsWith("redirect_") && envvar.length > 9) {
          this.redirects.set(envvar.substr(9), process.env[envvar] ?? "");
        }
      }
    }

    this.githubAccessToken = process.env.githubAccessToken || "";
  }

  public getRedirects(): Map<string, string> {
    return this.redirects;
  }

  public getGithubAccessToken(): string {
    return this.githubAccessToken;
  }
}

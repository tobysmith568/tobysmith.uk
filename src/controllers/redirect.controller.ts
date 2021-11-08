import { Router } from "express";
import { EnvironmentService } from "src/services/environment.service";
import { ExpressService } from "src/services/express.service";
import { singleton } from "tsyringe";
import { IController } from "./controller.interface";

@singleton()
export class RedirectController implements IController {
  private readonly router: Router;

  constructor(expressService: ExpressService, environmentService: EnvironmentService) {
    this.router = expressService.createRouter();

    for (const redirect of environmentService.config.redirects) {
      this.router.get("/" + redirect.key, (_, res) => res.redirect(redirect.url));
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}

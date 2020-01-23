import { Router, Request, Response } from "express";
import { IRoute } from "./route.interface";
import { Config } from "../config/config";

export class RedirectRoute implements IRoute {

  constructor(private readonly expressRouter: Router,
              private readonly config: Config) {}

  public setupRoutes(): void {
    
    for (const pair of this.config.getRedirects()) {
      this.expressRouter.get("/" + pair[0], async (req: Request, res: Response) => { res.redirect(pair[1]); });
    }
  }
  
  public getRouter(): Router {
    return this.expressRouter;
  }
}

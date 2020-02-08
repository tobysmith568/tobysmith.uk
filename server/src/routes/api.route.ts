import { Router } from "express";
import { IRoute } from "./route.interface";
import { APIController } from "../controllers/api.controller";

export class APIRoute implements IRoute {

  constructor(private readonly expressRouter: Router,
              private readonly controller: APIController) {}

  public setupRoutes(): void {
    this.expressRouter.get("/repos", this.controller.repos);
    this.expressRouter.get("/gh-widget", this.controller.githubWidget);
  }
  
  public getRouter(): Router {
    return this.expressRouter;
  }
}

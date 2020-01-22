import { Router, Request, Response, static as staticHost } from "express";
import { IRoute } from "./route.interface";
import * as path from "path";

export class NotFoundRoute implements IRoute {

  constructor(private readonly expressRouter: Router) {}

  public setupRoutes(): void {
    this.expressRouter.get("*", async (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname + "../../..//dist/index.html"));
    });
  }
  
  public getRouter(): Router {
    return this.expressRouter;
  }
}

import * as express from "express";
import { Express, Router } from "express";
import { Server as HTTPServer } from "http";
import { RedirectRoute } from "./routes/redirect.route";
import { Config } from "./config/config";
import { NotFoundRoute } from "./routes/notfound.route";

export class Server {

  private readonly config: Config;
  private readonly app: Express;
  private readonly httpServer: HTTPServer;

  constructor() {
    this.config = new Config();
    this.app = express();
    this.httpServer = new HTTPServer(this.app);
  }

  public initializeControllers() {

    const mainRoute = new RedirectRoute(Router(), this.config);
    const notFoundRoute = new NotFoundRoute(Router());

    mainRoute.setupRoutes();

    this.app.use([
      mainRoute.getRouter(),
    ]);

    this.app.use(express.static("dist"));

    notFoundRoute.setupRoutes();

    this.app.use([
      notFoundRoute.getRouter()
    ]);
  }

  public listen(): void {
    this.httpServer.listen(3000, () => {
      console.log(`Server started at port ${3000}`);
    });
  }
}

import * as express from "express";
import * as path from "path";
import { Express, Router } from "express";
import { Server as HTTPServer } from "http";
import { Config } from "./config/config";
import { RedirectRoute } from "./routes/redirect.route";
import { NotFoundRoute } from "./routes/notfound.route";
import { APIRoute } from "./routes/api.route";
import { APIController } from "./controllers/api.controller";

export class Server {

  private readonly config: Config;
  private readonly app: Express;
  private readonly httpServer: HTTPServer;

  private readonly apiController: APIController;

  constructor() {
    this.config = new Config();
    this.app = express();
    this.httpServer = new HTTPServer(this.app);

    this.apiController = new APIController(this.config);
  }

  public initializeControllers() {

    const apiRoute = new APIRoute(Router(), this.apiController);
    apiRoute.setupRoutes();
    this.app.use("/api", [
      apiRoute.getRouter(),
    ]);

    const redirectRoute = new RedirectRoute(Router(), this.config);
    redirectRoute.setupRoutes();
    this.app.use([
      redirectRoute.getRouter(),
    ]);
    
    this.app.use(express.static(path.join(__dirname, "../../public")));
    
    const notFoundRoute = new NotFoundRoute(Router());
    notFoundRoute.setupRoutes();
    this.app.use([
      notFoundRoute.getRouter()
    ]);
  }

  public listen(): void {
    const port = process.env.PORT || 3000;

    this.httpServer.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  }
}

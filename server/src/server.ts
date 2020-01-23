import * as express from "express";
import * as path from "path";
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

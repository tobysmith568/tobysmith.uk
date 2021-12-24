import "reflect-metadata";
import "zone.js/dist/zone-node";

import { ngExpressEngine } from "@nguniversal/express-engine";
import * as express from "express";
import { join } from "path";
import { AppServerModule } from "./src/main.server";
import { APP_BASE_HREF } from "@angular/common";
import { existsSync } from "fs";
import { container } from "tsyringe";
import { json } from "express";
import { RedirectController } from "src/controllers/redirect.controller";
import { EmailController } from "src/controllers/email.controller";
import { RssController } from "src/controllers/rss.controller";

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), "dist/tobysmith-uk/browser");
  const indexHtml = existsSync(join(distFolder, "index.original.html")) ? "index.original.html" : "index";

  const redirectController = container.resolve(RedirectController);
  const emailController = container.resolve(EmailController);
  const rssController = container.resolve(RssController);

  server.engine(
    "html",
    ngExpressEngine({
      bootstrap: AppServerModule
    })
  );

  server.set("view engine", "html");
  server.set("views", distFolder);

  server.use("", redirectController.getRouter());
  server.use("/api/send-email", json(), emailController.getRouter());
  server.use("/blog/rss", rssController.getRouter());

  server.get("*.*", express.static(distFolder, { maxAge: "1y" }));

  server.get("*", (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || "";
if (moduleFilename === __filename || moduleFilename.includes("iisnode")) {
  run();
}

export * from "./src/main.server";

import * as fs from "fs";

fs.copyFileSync("../server/dist/index.html", "../server/dist/404.html");

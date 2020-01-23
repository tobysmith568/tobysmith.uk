import * as dotenv from "dotenv";
import { Server } from "./src/server";

dotenv.config();

const server = new Server();
server.initializeControllers();
server.listen();

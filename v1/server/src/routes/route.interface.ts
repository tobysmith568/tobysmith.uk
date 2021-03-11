import * as express from "express";

export interface IRoute {
  setupRoutes(): void;

  getRouter(): express.Router;
}

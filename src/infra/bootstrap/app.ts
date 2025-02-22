import "reflect-metadata";
import "dotenv";
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "../container/container.js";
import express from "express";
import { AppInterface } from "./interfaces/app.interface.js";

export class App implements AppInterface {
  private server: InversifyExpressServer;

  constructor() {
    this.server = new InversifyExpressServer(container);
    this.server.setConfig((app) => {
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
    });
  }

  public start(): void {
    const app = this.server.build();
    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  }
}

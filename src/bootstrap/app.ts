import "reflect-metadata";
import "dotenv/config";
import { InversifyExpressServer } from "inversify-express-utils";
import express from "express";
import { AppInterface } from "./interfaces/app.interface.js";
import { container } from "../infra/ioc/container.js";

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
    app.listen(3000, () =>
      console.log("🚀 Server running on port 3000" + process.env.OPENAI_API_KEY)
    );
  }
}

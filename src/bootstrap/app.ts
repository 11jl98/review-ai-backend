import "reflect-metadata";
import "dotenv/config";
import { InversifyExpressServer } from "inversify-express-utils";
import express from "express";
import { AppInterface } from "./interfaces/app.interface.js";
import { container } from "../infra/ioc/container.js";
import { env } from "../infra/env/index.js";
import { Queue } from "../infra/queue/queue.js";
import { TYPES } from "../infra/ioc/types.js";
import { QueueController } from "src/infra/controllers/queue.controller.js";

export class App implements AppInterface {
  private server: InversifyExpressServer;

  public async initialize(): Promise<void> {
    this.serverSetup();
    await this.queueSetup();
    this.listen();
  }

  private serverSetup(): void {
    this.server = new InversifyExpressServer(container);
    this.server.setConfig((app) => {
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
    });
  }

  private listen(): void {
    const app = this.server.build();
    app.listen(
      {
        port: env.PORT,
        host: env.HOST,
      },
      () => console.log(`🚀 Server running on port ${env.PORT}`)
    );
  }

  private async queueSetup(): Promise<void> {
    const queue = container.get<Queue>(TYPES.Queue);
    await queue.connect();
  }
}

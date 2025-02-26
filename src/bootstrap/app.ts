import "reflect-metadata";
import "dotenv/config";
import { InversifyExpressServer } from "inversify-express-utils";
import express from "express";
import { AppInterface } from "./interfaces/app.interface.js";
import { container } from "../infra/ioc/container.js";
import { env } from "../infra/env/index.js";
import { Queue } from "../infra/queue/queue.js";
import { TYPES } from "../infra/ioc/types.js";
import { QueueConsumer } from "../infra/queue/queue.consumer.js";
import { EVENTS } from "../infra/queue/events.js";
import { inject } from "inversify";
import { Logger } from "../infra/logger/logger.js";

export class App implements AppInterface {
  private server: InversifyExpressServer;
  private logger: Logger;
  constructor() {
    this.logger = container.get<Logger>(TYPES.logger);
  }

  public async initialize(): Promise<void> {
    try {
      this.serverSetup();
      await this.queueConnect(); // ✅ Garante conexão antes de iniciar o consumidor
      await this.queueInit();
      this.listen();
    } catch (error) {
      this.logger.error(`❌ Erro ao inicializar a aplicação: ${error}`);
    }
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
      () => this.logger.info(`🚀 Server running on port ${env.PORT}`)
    );
  }

  private async queueConnect(): Promise<void> {
    try {
      this.logger.info("🔌 Conectando ao RabbitMQ...");
      const queue = container.get<Queue>(TYPES.Queue);
      await queue.connect();
      this.logger.info("✅ Conexão com RabbitMQ estabelecida.");
      queue.publish(EVENTS.LOG, { message: "Server started" });
    } catch (error) {
      this.logger.error(`❌ Erro ao conectar ao RabbitMQ: ${error}`);
      throw error;
    }
  }

  private async queueInit(): Promise<void> {
    try {
      this.logger.info("🎧 Iniciando consumidor de filas...");
      const consumer = container.get<QueueConsumer>(QueueConsumer);
      await consumer.start();
      this.logger.info("✅ Consumidor de filas iniciado com sucesso.");
    } catch (error) {
      this.logger.error(`❌ Erro ao iniciar consumidores: ${error}`);
    }
  }
}

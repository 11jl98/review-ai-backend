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
import { Logger } from "../infra/logger/logger.js";
import { LoggerInterface } from "src/infra/logger/interfaces/logger.interface.js";
import { MiddlewareInterface } from "src/infra/middlewares/interfaces/middleware.interface.js";
import { ValidateEventsMiddleware } from "src/infra/middlewares/validate-events/validate-event.middleware.js";
import { VerifySignatureMiddleware } from "src/infra/middlewares/signature-validator/signature-validator.middleware.js";

export class App implements AppInterface {
  private server: InversifyExpressServer;
  private logger: LoggerInterface;
  private validateEventsMiddleware: MiddlewareInterface;
  private verifySignatureMiddleware: MiddlewareInterface;
  constructor() {
    this.logger = container.get<Logger>(TYPES.Logger);
    this.validateEventsMiddleware = container.get<ValidateEventsMiddleware>(
      TYPES.Middlewares.ValidateEventsMiddleware
    );
    this.verifySignatureMiddleware = container.get<VerifySignatureMiddleware>(
      TYPES.Middlewares.VerifySignatureMiddleware
    );
  }

  public async initialize(): Promise<void> {
    try {
      this.serverSetup();
      await this.queueConnect();
      await this.queueInit();
      this.listen();
    } catch (error) {
      this.logger.error(`❌ Erro ao inicializar a aplicação: ${error}`);
    }
  }

  private serverSetup(): void {
    this.server = new InversifyExpressServer(container);
    this.server.setConfig((app) => {
      this.setMiddleware(app);
    });
  }

  private setMiddleware(app: express.Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        this.verifySignatureMiddleware.use(req, res, next);
      }
    );
    app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        this.validateEventsMiddleware.use(req, res, next);
      }
    );
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

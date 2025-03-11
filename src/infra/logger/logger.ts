import { injectable } from "inversify";
import winston from "winston";
import { LoggerInterface } from "./interfaces/logger.interface.js";

@injectable()
export class Logger implements LoggerInterface {
  private logger: winston.Logger;

  constructor() {
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    return winston.createLogger({
      level: "info",
      format: this.createFormat(),
      transports: [
        new winston.transports.Console({
          format: this.createConsoleFormat(),
        }),
      ],
    });
  }

  private createFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.timestamp({
        format: this.formatTimestamp(),
      }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      }),
      winston.format.prettyPrint(),
      winston.format.json()
    );
  }

  private createConsoleFormat(): winston.Logform.Format {
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    );
  }

  private formatTimestamp(): string {
    return new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }
}

import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { MiddlewareInterface } from "./interfaces/middleware.interface.js";

export class CorrelationIdMiddleware implements MiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction): void {
    const correlationId = uuidv4();
    req.correlation_id = correlationId;
    next();
  }
}

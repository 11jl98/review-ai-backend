import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { MiddlewareInterface } from "../interfaces/middleware.interface.js";

export class ValidateEventsMiddleware implements MiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction): void {
    const { action } = req.body;
    if (
      action !== "opened" &&
      action !== "synchronize" &&
      action !== "reopened"
    ) {
      res.status(200).send("Ignoring event");
      return;
    }
    next();
  }
}

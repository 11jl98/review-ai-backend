import { Request, Response, NextFunction } from "express";

export interface MiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void;
}

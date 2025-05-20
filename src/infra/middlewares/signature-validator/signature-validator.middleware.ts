import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { env } from "src/infra/env"; // Onde você guarda suas variáveis de ambiente
import { MiddlewareInterface } from "../interfaces/middleware.interface";

export class VerifySignatureMiddleware implements MiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const signature = req.headers["x-hub-signature-256"] as string;
      if (!signature) {
        res.status(400).send({ error: "Invalid request: Missing signature" });
        return;
      }
      const stringBody = JSON.stringify(req.body); // já virou objeto
      const rawBodyBuffer = Buffer.from(stringBody, "utf-8");
      const expectedSignature = `sha256=${crypto
        .createHmac("sha256", env.GITHUB_WEBHOOK_SECRET)
        .update(rawBodyBuffer)
        .digest("hex")}`;
      if (
        !crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        )
      ) {
        res.status(400).send({ error: "Invalid request: Signature mismatch" });
        return;
      }
      next();
    } catch (error) {
      res.status(500).send({ error: "Internal server error " + error });
    }
  }
}

import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import * as dotenv from "dotenv";
import { container } from "../ioc/container/container";
import { AppInterface } from "./interfaces/app.interface";

export class App implements AppInterface {
  private server: InversifyExpressServer;

  constructor() {
    this.server = new InversifyExpressServer(container);
  }

  public start(): void {
    dotenv.config();
    const app = this.server.build();
    app.listen(3000, () => console.log("🚀 Server running on port 3000"));
  }
}

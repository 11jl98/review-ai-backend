import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { container} from '../container/container'
import * as dotenv from "dotenv";

export class App {
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

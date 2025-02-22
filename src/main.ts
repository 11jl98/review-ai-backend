import "reflect-metadata";
import { App } from "./infra/bootstrap/server-build.js";

const app = new App();
app.start();
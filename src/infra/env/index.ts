import { config } from "dotenv";
import { z } from "zod";
import { fromError } from "zod-validation-error";

const envObject = config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
}).parsed;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  PORT: z.coerce.number(),
  HOST: z.string().default("0.0.0.0"),
  GITHUB_TOKEN: z.string(),
  RABBITMQ_URL: z.string(),
  OLLAMA_URL: z.string(),
  GITHUB_APPS_KEY: z.string(),
  GITHUB_APP_INSTALLATION_ID: z.coerce.number(),
  GITHUB_APP_ID: z.string(),
  GITHUB_WEBHOOK_SECRET: z.string(),
  NEO4J_URI: z.string().default("bolt://localhost:7687"),
  NEO4J_USER: z.string().default("neo4j"),
  NEO4J_PASSWORD: z.string(),
});

const _env = envSchema.safeParse(envObject);
if (!_env.success) {
  const validationError = fromError(_env.error);
  console.error(validationError.toString());
  throw new Error("Invalid environment variables ❌");
}

const env = _env.data;

export { env };

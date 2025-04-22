import fetch from "node-fetch";
import { AiProviderInterface } from "./interfaces/ai.provider.interface";
import { env } from "src/infra/env";
import { injectable } from "inversify";
import { INSTRUCTION_FOR_IA, MODELS } from "src/constants/ai";

@injectable()
export class OllamaProvider implements AiProviderInterface {
  async generate(fileReview: string): Promise<string> {
    const fileToReview = fileReview.substring(0, 10000);
    const prompt = `${INSTRUCTION_FOR_IA.message}\n\nUser:\n${fileToReview}`;
    const response = await fetch(env.OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODELS.ollama,
        prompt,
        stream: false,
      }),
    });
    const data = await response.json();
    return data.response || "";
  }
}

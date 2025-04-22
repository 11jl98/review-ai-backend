import OpenAI from "openai";
import { AiProviderInterface } from "./interfaces/ai.provider.interface";
import { injectable } from "inversify";
import { INSTRUCTION_FOR_IA, MODELS } from "src/constants/ai";

@injectable()
export class OpenAiProvider implements AiProviderInterface {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generate(fileReview: string): Promise<string> {
    const res = await this.openai.chat.completions.create({
      model: MODELS.openai,
      messages: [
        {
          role: "system",
          content: INSTRUCTION_FOR_IA.message,
        },
        { role: "user", content: fileReview.substring(0, 10000) },
      ],
    });

    return res.choices[0]?.message?.content || "";
  }
}

import { injectable } from "inversify";
import OpenAI from "openai";
import { OpenAIServiceInterface } from "./interfaces/apoenai.service.interface.js";

@injectable()
export class OpenAIService implements OpenAIServiceInterface {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processFileToReview(code: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a senior developer and need to perform a code review. Please provide feedback on best practices and potential improvements based on clean code, solid code and even clean architecture.",
          },
          { role: "user", content: code.substring(0, 10000) },
        ],
      });

      return response.choices[0]?.message?.content || "No response from AI";
    } catch (error: any) {
      console.error("❌ Erro ao chamar OpenAI:", error);
      return `Não foi possível processar o PR`;
    }
  }
}

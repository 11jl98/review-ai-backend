import { injectable } from "inversify";
import axios from "axios";
import { OpenAIServiceInterface } from "./interfaces/apoenai.service.interface";

@injectable()
export class OpenAIService implements OpenAIServiceInterface {
  public async processFileToReview(code: string): Promise<string> {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a senior developer and need to perform a code review. Please provide feedback on best practices and potential improvements based on clean code, solid code and even clean architecture.",
          },
          { role: "user", content: code },
        ],
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
    );

    return response.data.choices[0].message.content;
  }
}

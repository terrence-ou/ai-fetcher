import axios from "axios";
import type {
  ClaudeInputData,
  ClaudeMessage,
  ClaudeModel,
  ClaudeResult,
} from "../types/types.js";

export class Claude {
  private api: string;
  private headers: {
    "x-api-key": string;
    "anthropic-version": string;
    "Content-Type": string;
  };
  public endpoint: string;
  public model: ClaudeModel;

  constructor(
    claudeKey: string,
    model: ClaudeModel = "claude-3-haiku-20240307",
  ) {
    this.api = claudeKey;
    this.endpoint = "https://api.anthropic.com/v1/messages";
    this.model = model;

    this.headers = {
      "x-api-key": this.api,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    };
  }

  async generate(
    system: string,
    messages: ClaudeMessage[],
    temperature: number = 0,
    max_tokens: number = 1000,
  ): Promise<ClaudeResult> {
    const data: ClaudeInputData = {
      model: this.model,
      max_tokens,
      temperature,
      system,
      messages,
    };
    try {
      const response = (await axios.post(this.endpoint, data, {
        headers: this.headers,
      })) as ClaudeResult;
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

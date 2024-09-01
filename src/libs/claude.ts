import axios from "axios";
import type {
  ClaudeInputData,
  ClaudeMessage,
  ClaudeModel,
  ClaudeResult,
} from "../types/types.js";

// The Claude Agent class
export class Claude {
  private api: string; // API key provided by the user
  private headers: {
    "x-api-key": string;
    "anthropic-version": string;
    "Content-Type": string;
  }; // Headers for Claude requests
  public endpoint: string; // The API endpoint url
  public model: ClaudeModel; // The flag to specify the Claude model

  /*
   * Constructs a new instance of Claude class
   * @param claudeKey: string - The user's Claude authentication key
   * @param model: ClaudeModel - Should be one of the model string provided by Claude
   */
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

  /*
   * Generates a response from Claude
   * @param system: string.
   */
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
      const response = await axios.post(this.endpoint, data, {
        headers: this.headers,
      });
      return response.data as ClaudeResult;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

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
      "anthropic-version": "2023-06-01", // This is the current version provided by the Claude
      "Content-Type": "application/json",
    };
  }

  /*
   * Generates a response from Claude.
   * @param system: string - The system prompt or context that guides the model's behavior.
   * @param messages: ClaudeMessage[] - An array of ClaudeMessages representing the conversation history.
   * @param temperature (Optional): number - A number between 0 and 1 that controls the randomness of the output. Defaults to 0.
   * @param max_tokens (Optional): number - A number represents the maximum output tokens (words or word fragments). Defaults to 1000.
   *
   * @returns A promise that resolves to a ClaudeResult containing the generated text result.
   * @throws An error is the API request fails.
   */
  async generate(
    system: string,
    messages: ClaudeMessage[],
    temperature: number = 0,
    max_tokens: number = 1000,
  ): Promise<ClaudeResult> {
    // Limits the temperature between 0.0 and 1.0
    const validatedTemp = Math.min(1.0, Math.max(0.0, temperature));
    // Limits the minimum max_token to 0
    const validatedToken = Math.max(0, Math.round(max_tokens));
    const data: ClaudeInputData = {
      model: this.model,
      max_tokens: validatedToken,
      temperature: validatedTemp,
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

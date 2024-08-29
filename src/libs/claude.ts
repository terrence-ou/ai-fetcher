type ClaudeModel =
  | "claude-3-haiku-20240307"
  | "claude-3-sonnet-20240229"
  | "claude-3-opus-20240229"
  | "claude-3-5-sonnet-20240620";

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

  async generate() {}
}

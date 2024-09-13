import axios from "axios";
import {
  OpenAIChatModel,
  OpenAIInputData,
  OpenAIMessage,
  OpenAIResult,
  OpenAISpeechModel,
} from "../types/types.js";

export class OpenAI {
  chat(apiKey: string, model: OpenAIChatModel) {
    return new Chat(apiKey, model);
  }

  textToAudio(apiKey: string) {
    return new TextToAudio(apiKey);
  }
}

class Chat {
  private apiKey: string;
  private headers: {
    "Content-Type": string;
    Authorization: string;
  };
  public model: OpenAIChatModel;
  public endpoint: string;

  constructor(openAIKey: string, model: OpenAIChatModel) {
    this.apiKey = openAIKey;
    this.model = model;
    this.endpoint = "https://api.openai.com/v1/chat/completions";
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async generate(
    messages: OpenAIMessage[],
    system = "You are a helpful assistant.",
  ) {
    const systemMessage: OpenAIMessage = { role: "system", content: system };
    const requestMessage: OpenAIMessage[] = [systemMessage, ...messages];
    const data: OpenAIInputData = {
      model: this.model,
      messages: requestMessage,
    };
    try {
      const response = await axios.post(this.endpoint, data, {
        headers: this.headers,
      });
      return response.data as OpenAIResult;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

class TextToAudio {
  private apiKey: string;
  public model: OpenAISpeechModel;
  public endpoint: string;
  constructor(openAIKey: string) {
    this.apiKey = openAIKey;
    this.endpoint = "https://api.openai.com/v1/audio/speech";
    this.model = "tts-1";
  }

  convert() {}
}

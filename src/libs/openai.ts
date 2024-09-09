import { OpenAIChatModel } from "../types/types.js";

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
  private model: OpenAIChatModel;
  constructor(openAIKey: string, model: OpenAIChatModel) {
    this.apiKey = openAIKey;
    this.model = model;
  }

  generate() {}
}

class TextToAudio {
  private apiKey: string;
  constructor(openAIKey: string) {
    this.apiKey = openAIKey;
  }

  convert() {}
}

import axios from "axios";
import fs from "fs";
import path from "path";
import {
  OpenAIChatModel,
  OpenAIChatInputData,
  OpenAIMessage,
  OpenAIChatResult,
  OpenAISpeechModel,
  OpenAITTSResult,
  OpenAITTSVoice,
  OpenAITTSInputData,
} from "../types/types.js";

export class OpenAI {
  static chat(apiKey: string, model: OpenAIChatModel = "gpt-4o-mini") {
    return new Chat(apiKey, model);
  }

  static textToSpeech(apiKey: string) {
    return new TextToSpeech(apiKey);
  }
}

export class Chat {
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
  ): Promise<OpenAIChatResult> {
    const systemMessage: OpenAIMessage = { role: "system", content: system };
    const requestMessage: OpenAIMessage[] = [systemMessage, ...messages];
    const data: OpenAIChatInputData = {
      model: this.model,
      messages: requestMessage,
    };
    try {
      const response = await axios.post(this.endpoint, data, {
        headers: this.headers,
      });
      return response.data as OpenAIChatResult;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

export class TextToSpeech {
  private apiKey: string;
  public model: OpenAISpeechModel;
  public endpoint: string;
  private headers: {
    "Content-Type": string;
    Authorization: string;
  };
  constructor(openAIKey: string) {
    this.apiKey = openAIKey;
    this.endpoint = "https://api.openai.com/v1/audio/speech";
    this.model = "tts-1";
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async convert(
    text: string | undefined,
    returnType: "filename" | "buffer" | "base64" = "filename",
    filename: string = "speech.mp3",
    voice: OpenAITTSVoice = "alloy",
  ): Promise<OpenAITTSResult> {
    // if the input text is undefined, throw an error
    if (text === undefined) throw new Error("The input text is undefined");
    const data: OpenAITTSInputData = { model: this.model, input: text, voice };
    try {
      const response = await axios.post(this.endpoint, data, {
        headers: this.headers,
        responseType: "arraybuffer",
      });
      const buffer = response.data as Buffer;

      if (returnType === "buffer") return buffer;
      else if (returnType === "base64") return buffer.toString("base64");
      else if (returnType === "filename") {
        const validatedFilename = processFilename(filename);
        const outputPath = path.resolve(validatedFilename);
        await fs.promises.writeFile(outputPath, buffer);
        return outputPath;
      } else return undefined;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

export const processFilename = (originalFilename: string) => {
  const paths = originalFilename.split("/").filter((path) => path !== "");
  if (paths.length === 0) return "speech.mp3";
  const extension = paths.slice(-1)[0].slice(-4);
  if (extension !== ".mp3") paths.push("speech.mp3");
  return paths.join("/");
};

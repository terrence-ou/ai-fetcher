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
  static chat(apiKey: string, model: OpenAIChatModel) {
    return new Chat(apiKey, model);
  }

  static textToAudio(apiKey: string) {
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

class TextToAudio {
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
    voice: OpenAITTSVoice = "alloy",
    returnType: "filename" | "buffer" | "base64" = "filename",
    filename: string = "speech.mp3",
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
        // TODO: implement path validation
        const outputPath = path.resolve(`./${filename}`);
        await fs.promises.writeFile(outputPath, buffer);
        return outputPath;
      } else return undefined;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

// const processFilename = (originalFilename: string): string => {
//   console.log(originalFilename);
//   return originalFilename;
// };

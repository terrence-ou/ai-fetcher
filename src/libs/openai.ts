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

// The OpenAI Agent class
export class OpenAI {
  /**
   * Initialize a new OpenAI chat instance
   * @param apiKey: string - The user's OpenAI authentication key
   * @param model (Optional): OpenAIChatModel - one of the available chat model provided by OpenAI. Defaults to "gpt-40-mini", the cheapest one
   * @returns An instance of OpenAI Chat model
   */
  static chat(apiKey: string, model: OpenAIChatModel = "gpt-4o-mini") {
    return new Chat(apiKey, model);
  }

  /**
   * Initialize a new OpenAI TTS instance
   * @param apiKey: string - The user's OpenAI authentication key
   * @returns An instance of OpenAI TTS model
   */
  static textToSpeech(apiKey: string) {
    return new TextToSpeech(apiKey);
  }
}

// The OpenAI Chat class
export class Chat {
  private apiKey: string; // API key provided by user
  private headers: {
    "Content-Type": string;
    Authorization: string;
  }; // Headers for the OpenAI request
  public model: OpenAIChatModel; // Available OpenAI chat models
  public endpoint: string; // The chat API endpoint url

  /**
   * Constructs a new instance of OpenAI Chat class
   * @param openAIKey: string - The user's OpenAI authentication key
   * @param model: OpenAIChatModel - one of the available chat model provided by OpenAI
   */
  constructor(openAIKey: string, model: OpenAIChatModel) {
    this.apiKey = openAIKey;
    this.model = model;
    this.endpoint = "https://api.openai.com/v1/chat/completions";
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   *
   * @param messages: OpenAIMessage[] - an array of OpenAIMessages representing the conversation history.
   * @param system (Optional): string - The system prompt or content that guides the model's behavior.
   * @returns A proimise that resolves to a OpenAIChatResult containing the generated chat output.
   * @throws An error if the API request fails
   */
  async generate(
    messages: OpenAIMessage[],
    system = "You are a helpful assistant.",
  ): Promise<OpenAIChatResult> {
    const systemMessage: OpenAIMessage = { role: "system", content: system };
    const requestMessages: OpenAIMessage[] = [systemMessage, ...messages];
    const data: OpenAIChatInputData = {
      model: this.model,
      messages: requestMessages,
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

// The OpenAI TextToSpeech class
export class TextToSpeech {
  private apiKey: string; // API key provided by user
  public model: OpenAISpeechModel; // Available OpenAI TTS model(s)
  public endpoint: string; // The TTS API endpoint url/
  private headers: {
    "Content-Type": string;
    Authorization: string;
  }; // Headers for the OpenAI request

  /**
   * Constructs a new instance of OpenAI TTS class
   * @param openAIKey: string - The user's OpenAI authentication key
   */
  constructor(openAIKey: string) {
    this.apiKey = openAIKey;
    this.endpoint = "https://api.openai.com/v1/audio/speech";
    this.model = "tts-1";
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  /**
   *
   * @param text: string | undefined - The text that you want to convert to speech.
   * @param returnType (Optional): "filename" | "buffer" | "base64" - Specifies the format in which the result should be returned.
   * @param filename (Optional): string - The name of the file to save the speech when `returnType` is "filename". Defaults to "speech.mp3".
   * @param voice (Optional): OpenAITTSVoice - The voice model to use for the speech synthesis. Defaults to "alloy"
   * @returns A promise that resolves to the result of the conversion, depending on the `returnType`
   *   - If `returnType` is "filename", the promise resolves to the file path of the saved audio.
   *   - If `returnType` is "buffer", the promise resolves to a `Buffer` containing the audio data.
   *   - If `returnType` is "base64", the promise resolves to a Base64-encoded string of the audio data.
   *   - If no valid `returnType` is specified, it returns `undefined`.
   * @throws Error - Throws an error if the input `text` is undefined or if there is a failure during the request to the API.
   */
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

/**
 * Processes and validates the given filename, ensuring that it has the correct format and file extension.
 *
 * @param originalFilename: string - The original filename or file path provided by the user.
 * @returns string - The processed filename with a valid ".mp3" extension and proper path structure.
 */
export const processFilename = (originalFilename: string) => {
  const paths = originalFilename.split("/").filter((path) => path !== "");
  if (paths.length === 0) return "speech.mp3";
  const extension = paths.slice(-1)[0].slice(-4);
  if (extension !== ".mp3") paths.push("speech.mp3");
  return paths.join("/");
};

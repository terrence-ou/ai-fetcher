import axios from "axios";
import type { DeepLResult } from "../types/types";

// The DeepL Agent class
export class DeepL {
  private apiKey: string; // API key provided by the user
  private isPro: boolean; // Flag to indicate whether the user is using the pro version api
  private headers: { Authorization: string; "Content-Type": string }; // Headers for DeepL requests

  public url: string; // The API endpoint url
  public endpoints: { free: string; pro: string };

  /**
   * Construcs a new instance of DeepL class
   * @param deepLKey: string - The user's DeepL authentication key
   * @param isPro (optional) - boolean. Specifies if the user is using the pro version api
   */
  constructor(deepLKey: string, isPro: boolean = false) {
    this.apiKey = deepLKey;
    this.isPro = isPro;
    this.endpoints = {
      free: "https://api-free.deepl.com/v2/translate",
      pro: "https://api.deepl.com/v2/translate",
    };
    this.url = this.isPro ? this.endpoints["pro"] : this.endpoints["free"];
    this.headers = {
      Authorization: `DeepL-Auth-Key ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Translate the given text fron one language to another
   * The input is an JavaScript Object
   * @param from (optional): string - Should be one of the supported language.
   * @param to: string - Should be one of the supported language.
   * @param text: string[] | string - The source text(s) to be translated.
   *
   * @returns A Promise that resolves to a DeepLResult containing the translation
   * @throws An error if the API request fails
   */
  async translate({
    from,
    to,
    text,
  }: {
    from?: string;
    to: string;
    text: string[] | string;
  }): Promise<DeepLResult> {
    // DeepL requires the input text to be an array of strings
    const inputText = typeof text === "string" ? [text] : text;
    const data: { source_lang?: string; target_lang: string; text: string[] } =
      {
        text: inputText,
        target_lang: to.toUpperCase(),
      };
    // source_lang is an optional attribute for the DeepL request
    if (from) {
      data.source_lang = from.toUpperCase();
    }
    try {
      const response = await axios.post(this.url, data, {
        headers: this.headers,
      });
      return response.data as DeepLResult;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error(String(error));
    }
  }
}

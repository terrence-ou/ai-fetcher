import axios from "axios";
import { TRANSLATION_FAIL_MESSAGE } from "./consts.js";
import type { DeepLResult } from "../types/types.js";

export class DeepL {
  private api: string;
  private isPro: boolean;
  private headers: { Authorization: string; "Content-Type": string };
  public url: string;

  endpoints = {
    free: "https://api-free.deepl.com/v2/translate",
    pro: "https://api.deepl.com/v2/translate",
  };

  constructor(deepLKey: string, pro: boolean = false) {
    this.api = deepLKey;
    this.isPro = pro;
    this.url = this.isPro ? this.endpoints["pro"] : this.endpoints["free"];
    this.headers = {
      Authorization: `DeepL-Auth-Key ${this.api}`,
      "Content-Type": "application/json",
    };
  }

  async translate(
    from: string,
    to: string,
    text: string[] | string,
  ): Promise<DeepLResult[]> {
    // DeepL requires the input text to be an array of strings
    const inputText = typeof text === "string" ? [text] : text;
    const data = {
      text: inputText,
      target_lang: to.toUpperCase(),
      source_lang: from.toUpperCase(),
    };
    try {
      const response = await axios.post(this.url, data, {
        headers: this.headers,
      });
      return response.data.translations as DeepLResult[];
    } catch (error) {
      console.error(error);
      return [
        {
          detected_source_language: "ERROR",
          text: TRANSLATION_FAIL_MESSAGE,
        },
      ];
    }
  }
}

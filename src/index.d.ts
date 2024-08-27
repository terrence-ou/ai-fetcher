import { DeepLResult } from "./types/types.js";

export class DeepL {
  private api: string;
  private isPro: boolean;
  private headers: { Authorization: string; "Content-Type": string };
  public url: string;

  constructor(deepLKey: string, pro?: boolean);
  translate(
    from: string,
    to: string,
    text: string | string[],
  ): Promise<DeepLResult[]>;
}

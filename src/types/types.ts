// Types for DeepL
export type DeepLContent = { detected_source_language: string; text: string };
export type DeepLResult = { translations: DeepLContent[] };

// Types for Claude
export type ClaudeModel =
  | "claude-3-haiku-20240307"
  | "claude-3-sonnet-20240229"
  | "claude-3-opus-20240229"
  | "claude-3-5-sonnet-20240620";

export type ClaudeContent = { type: string; text: string };
export type ClaudeMessage = { role: string; content: ClaudeContent[] };
export type ClaudeResult = {
  id: string;
  model: string;
  type: string;
  role: string;
  content: ClaudeContent[];
  stop_reason: string;
  stop_sequence: string;
  usage: { input_tokens: number; output_tokens: number };
};

export interface ClaudeInputData {
  model: ClaudeModel;
  max_tokens: number;
  temperature: number;
  system: string;
  messages: ClaudeMessage[];
}

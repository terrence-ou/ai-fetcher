// Types for DeepL
export type DeepLContent = { detected_source_language: string; text: string };
export type DeepLResult = { translations: DeepLContent[] };

// Types for Claude
export type ClaudeModel =
  | "claude-3-haiku-20240307"
  | "claude-3-sonnet-20240229"
  | "claude-3-opus-20240229"
  | "claude-3-5-sonnet-20241022";

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

// Types for OpenAI Chat
export type OpenAIChatModel =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "gpt-4";

export type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
export type OpenAIChatResult = {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    logprobs: null | object;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};
export interface OpenAIChatInputData {
  model: OpenAIChatModel;
  messages: OpenAIMessage[];
}

// Types for OpenAI Speech
export type OpenAISpeechModel = "tts-1" | "tts-1-hd";
export type OpenAITTSVoice =
  | "alloy"
  | "echo"
  | "fable"
  | "onyx"
  | "nova"
  | "shimmer";
export type OpenAITTSResult = string | Buffer | undefined;
export interface OpenAITTSInputData {
  model: OpenAISpeechModel;
  input: string;
  voice: OpenAITTSVoice;
}

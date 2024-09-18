import { expect, it, describe, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./mock/node";
import { OpenAI } from "../index";
import { Chat, TextToSpeech } from "../libs/openai";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockKey = "mockapikey";
// const invalidKey = "invalidkey";

// Testing OpenAI Chat services
describe("OpenAI Chat attributes check", () => {
  it("initialize OpenAI Chat agent", () => {
    const openaiAgent = OpenAI.chat(mockKey);
    expect(openaiAgent).toBeInstanceOf(Chat);
    expect(openaiAgent.endpoint).toBe(
      "https://api.openai.com/v1/chat/completions",
    );
    expect(openaiAgent.model).toBe("gpt-4o-mini");
  });
  it("initialize OpenAI Chat with different model", () => {
    const openaiAgent = OpenAI.chat(mockKey, "gpt-4-turbo");
    expect(openaiAgent.model).toBe("gpt-4-turbo");
    expect(openaiAgent.model).not.toBe("gpt-4o-mini");
  });
});

// Testing OpenAI TextToAudio service
describe("OpenAI TextToAudio attributes check", () => {
  it("initialize OpenAI TTS agent", () => {
    const openaiAgent = OpenAI.textToSpeech(mockKey);
    expect(openaiAgent).toBeInstanceOf(TextToSpeech);
    expect(openaiAgent.endpoint).toBe("https://api.openai.com/v1/audio/speech");
    expect(openaiAgent.model).toBe("tts-1");
  });
});

import { expect, it, describe, beforeAll, afterAll, afterEach } from "vitest";
import path from "path";
import { server } from "./mock/node";
import { OpenAI } from "../index";
import { Chat, processFilename, TextToSpeech } from "../libs/openai";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockKey = "mockapikey";
const invalidKey = "invalidkey";

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

describe("Fetch chat results", () => {
  it("get chat response", async () => {
    const openaiAgent = OpenAI.chat(mockKey);
    const response = await openaiAgent.generate([
      { role: "user", content: "" },
    ]);
    expect(response).toHaveProperty("choices");
    expect(response.choices.length).toBeGreaterThanOrEqual(1);
  });

  it("raise rejection when providing invalid key", async () => {
    const openaiAgent = OpenAI.chat(invalidKey);
    await expect(
      openaiAgent.generate([{ role: "user", content: "" }]),
    ).rejects.toThrowError();
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

describe("Fetch TTS results", () => {
  it("get TTS result with different formats", async () => {
    const openaiAgent = OpenAI.textToSpeech(mockKey);
    const bufferResponse = await openaiAgent.convert("test", "buffer");
    expect(bufferResponse).toBeInstanceOf(Buffer);
    const base64Response = await openaiAgent.convert("test", "base64");
    expect(base64Response).toBeTypeOf("string");
    const filenameResponse = await openaiAgent.convert(
      "test",
      "filename",
      "test.mp3",
    );
    expect(filenameResponse).toBe(path.resolve("./test.mp3"));
  });

  it("raise rejection when providing invalid key", async () => {
    const openaiAgent = OpenAI.textToSpeech(invalidKey);
    await expect(openaiAgent.convert("test")).rejects.toThrowError();
  });
});

// Testing processFilename helper function
describe("Test processFilename function", () => {
  it("empty filename provided", () => {
    expect(processFilename("")).toBe("speech.mp3");
    expect(processFilename(".///speech.mp3")).toBe("./speech.mp3");
    expect(processFilename("./")).toBe("./speech.mp3");
    expect(processFilename("./tempfolder/result.mp3")).toBe(
      "./tempfolder/result.mp3",
    );
  });
});

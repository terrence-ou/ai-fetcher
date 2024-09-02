import { expect, it, describe, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./mock/node";
import { DeepL } from "../index";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockKey = "mockapikey";
const invalidKey = "invalidkey";
const translationInput = { from: "ZH", to: "EN", text: "Mock text" };

describe("DeepL attribute checks", () => {
  it("initialize DeepL agent", () => {
    const deepLAgent = new DeepL(mockKey);
    expect(deepLAgent).toBeInstanceOf(DeepL);
    expect(deepLAgent.url).toBe("https://api-free.deepl.com/v2/translate");
  });
  it("check pro url", () => {
    const deepLAgent = new DeepL(mockKey, true);
    expect(deepLAgent.url).toBe("https://api.deepl.com/v2/translate");
  });
});

describe("Fetch translations", () => {
  it("check response properties", async () => {
    const deepLAgent = new DeepL(mockKey);
    const response = await deepLAgent.translate(translationInput);
    expect(response).toHaveProperty("translations");
    expect(response.translations).toBeInstanceOf(Array);
    expect(response.translations.length).toBeGreaterThanOrEqual(1);
    expect(response.translations[0]).toHaveProperty("detected_source_language");
    expect(response.translations[0]).toHaveProperty("text");
  });

  it("check free api response", async () => {
    const deepLAgent = new DeepL(mockKey);
    const response = await deepLAgent.translate(translationInput);
    expect(response.translations[0].detected_source_language).toBe("EN");
    expect(response.translations[0].text).toBe("Mock DeepL Free Response");
  });

  it("check pro api response", async () => {
    const deepLAgent = new DeepL(mockKey, true);
    const response = await deepLAgent.translate(translationInput);
    expect(response.translations[0].text).toBe("Mock DeepL Pro Response");
  });
});

describe("Provide invalid apikey to raise rejections", () => {
  it("check free api rejection", async () => {
    const deepLAgent = new DeepL(invalidKey);
    await expect(deepLAgent.translate(translationInput)).rejects.toThrowError();
  });

  it("check free api rejection", async () => {
    const deepLAgent = new DeepL(invalidKey, true);
    await expect(deepLAgent.translate(translationInput)).rejects.toThrowError();
  });
});

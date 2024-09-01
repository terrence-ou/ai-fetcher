import { expect, it, describe, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./mock/node";
import { Claude } from "../index";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockKey = "mockapikey";
const invalidKey = "invalidkey";

describe("Claude attribute checks", () => {
  it("initialize Claude agent", () => {
    const claudeAgent = new Claude(mockKey);
    expect(claudeAgent).toBeInstanceOf(Claude);
    expect(claudeAgent.endpoint).toBe("https://api.anthropic.com/v1/messages");
    expect(claudeAgent.model).toBe("claude-3-haiku-20240307");
  });

  it("initialize Claude agent with different model", () => {
    const claudeAgent = new Claude(mockKey, "claude-3-sonnet-20240229");
    expect(claudeAgent.model).not.toBe("claude-3-haiku-20240307");
    expect(claudeAgent.model).toBe("claude-3-sonnet-20240229");
  });
});

describe("Fetch generated results", () => {
  it("test", async () => {
    const claudeAgent = new Claude(mockKey);
    const response = await claudeAgent.generate(
      "you are a professional translation capable of translating between multiple languages.",
      [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "randomly generate 10 words",
            },
          ],
        },
      ],
      0,
      1000,
    );
    expect(response).toHaveProperty("content");
    expect(response.content.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Provide invalid apikey to raise rejections", () => {
  it("check api rejection", async () => {
    const claudeAgent = new Claude(invalidKey);
    await expect(
      claudeAgent.generate("test", [], 0, 1000),
    ).rejects.toThrowError();
  });
});

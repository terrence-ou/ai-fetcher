import { http, HttpResponse } from "msw";

const invalidKey = "invalidkey";

const deeplHandlers = [
  // mock deepl free api response
  http.post("https://api-free.deepl.com/v2/translate", ({ request }) => {
    const apiKey = request.headers.get("authorization")!.split(" ")[1];
    if (apiKey === invalidKey) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({
      translations: [
        { detected_source_language: "EN", text: "Mock DeepL Free Response" },
      ],
    });
  }),
  // mock deepl pro api response
  http.post("https://api.deepl.com/v2/translate", ({ request }) => {
    const apiKey = request.headers.get("authorization")!.split(" ")[1];
    if (apiKey === invalidKey) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({
      translations: [
        { detected_source_language: "EN", text: "Mock DeepL Pro Response" },
      ],
    });
  }),
];

const claudeHandlers = [
  http.post("https://api.anthropic.com/v1/messages", ({ request }) => {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey === invalidKey) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({
      id: "",
      model: "",
      type: "",
      role: "",
      content: [
        {
          type: "text",
          text: "Here are 100 randomly generated words",
        },
      ],
      stop_resaton: "",
      stop_sequence: "",
      usage: { input_tokens: 0, output_tokens: 0 },
    });
  }),
];

const openaiHandlers = [
  // mock openai chat response
  http.post("https://api.openai.com/v1/chat/completions", ({ request }) => {
    const apiKey = request.headers.get("authorization")!.split(" ")[1];
    if (apiKey === invalidKey) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json({
      id: "",
      object: "",
      created: new Date().getTime(),
      model: "",
      system_fingerprint: "",
      choices: [
        {
          index: 0,
          message: {
            role: "user",
            message: "response message",
            logprobs: null,
            finish_reason: "",
          },
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    });
  }),
  // mock openai tts response
  http.post("https://api.openai.com/v1/audio/speech", async ({ request }) => {
    const apiKey = request.headers.get("authorization")!.split(" ")[1];
    if (apiKey === invalidKey) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.arrayBuffer(Buffer.from("sample result"));
  }),
];

export const handlers = [
  ...deeplHandlers,
  ...claudeHandlers,
  ...openaiHandlers,
];

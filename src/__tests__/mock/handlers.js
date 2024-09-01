import { http, HttpResponse } from "msw";

const deeplHandlers = [
  // mock deepl free api response
  http.post("https://api-free.deepl.com/v2/translate", ({ request }) => {
    const apiKey = request.headers.get("authorization").split(" ")[1];
    if (apiKey === "invalidkey") {
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
    const apiKey = request.headers.get("authorization").split(" ")[1];
    if (apiKey === "invalidkey") {
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
    if (apiKey === "invalidkey") {
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

export const handlers = [...deeplHandlers, ...claudeHandlers];

import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("https://api-free.deepl.com/v2/translate", () => {
    return HttpResponse.json({
      translations: [
        { detected_source_language: "EN", text: "Mock DeepL Free Response" },
      ],
    });
  }),
  http.post("https://api.deepl.com/v2/translate", () => {
    return HttpResponse.json({
      translations: [
        { detected_source_language: "EN", text: "Mock DeepL Pro Response" },
      ],
    });
  }),
];

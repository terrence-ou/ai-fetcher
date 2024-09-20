# ai-fetcher

[![Test](https://github.com/terrence-ou/ai-fetcher/actions/workflows/CI.yml/badge.svg)](https://github.com/terrence-ou/ai-fetcher/actions/workflows/CI.yml)
<img height="20px" src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="LICENSE"/>

## Overview
`ai-fetcher` is a Node.js package that provides integration with popular language models. It is designed to facilitate easy and efficient ai-fetching tasks for your application. Currently the package supports Claude and DeepL models, and the supported models/services is keep expanding.

## Installation

```bash
$ npm install ai-fetcher@latest
```

## Supported AI Services

- DeepL - Supports both free and pro API keys;
- Claude - Supports regular text generation for now;

## Examples:
### DeepL:
```javascript
import { DeepL } from "ai-fetcher";

// Initialize the DeepL agent with your API key
const deepLAgent = new DeepL(YOUR_DEEPL_API_KEY, true); // Change `true` to `false` if not using Pro API key

// Example tranlation parameters
const translationParams = {
  from: "EN", // Source language code (optional, DeepL can also auto-detect the input language)
  to: "DE", // Target language code
  text: ["Hello world!", "This is a test translation"], // Text(s) to translate
};

// Call the translate method
async function translateText() {
  try {
    const result = await deepLAgent.translate(translationParams);
    console.log(result.translations);
    return result.translations;
  } catch (error) {
    console.error("Translation Error:", error);
  }
}

// Execute the function to translate the text
translateText();
```

### Claude:
```javascript
import { Claude } from "ai-fetcher";

// Initialize the Claude agent with your API key and preferred model
const claudeAgent = new Claude(YOUR_CLAUDE_API_KEY, "claude-3-haiku-20240307"); // You can also specify the model

// example system prompt and message for generating a response
const systemPrompt = "Write a haiku about the sea.";
const conversationHistory = [
  { role: "user", content: "Could you create a haiku about nature?" },
  {
    role: "assistant",
    content:"Certainly! Would you like one about any specific aspect of nature?",
  },
  { role: "user", content: "Yes, the sea." },
];

// Call the generate method
async function generateResponse() {
  try {
    const result = await claudeAgent.generate(
      systemPrompt,
      conversationHistory,
    );
    console.log(result.content);
    return result.content;
  } catch (error) {
    console.error(error);
  }
}

// execute the function and get the generated result
generateResponse();
```

### OpenAI:

#### *Chat Model*
```javascript
import { OpenAI } from "ai-fetcher"

// Initialize the OpenAI chat agent with your API key and preferred model
const openaiChatAgent = OpenAI.chat(YOUR_CLAUDE_API_KEY, "gpt-4o-mini");

// Call the generate method
async function generateResponse() {
  try {
    const result = await openaiChatAgent.generate([
      { role: "user", content: "Randomly generate 20 words" },
    ]);
    console.log(result.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

// execute the function and get the generated result
generateResponse();
```

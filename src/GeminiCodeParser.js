import { EventEmitter } from 'eventemitter3';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatPrompt } from './prompt.js';
import { parseResponse } from './ParseResponse.js';

export class GeminiCodeParser extends EventEmitter {
  constructor(apiKey, geminiModel) {
    super();
    const genAi = new GoogleGenerativeAI(apiKey);
    this.model = genAi.getGenerativeModel({model: geminiModel});
  }

  async generateContentStream(prompt) {
    const contentStream = this.model.generateContentStream(prompt);
    for await (const content of contentStream) {
      this.emit('content', content);
    }
  }

  async generateParsedCodeStream(prompt) {
    prompt = formatPrompt(prompt);

    const parsedCode = await parseResponse(prompt, this);

    return parsedCode;
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { envVars } from "../../../config/env";

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

export const AIService = {
  async chatWithAI(message: string) {
    const response = await axios.post(
      OPENROUTER_API,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are LawHive AI assistant.

- Help users book lawyers
- Explain legal process
- Suggest pricing
- Keep answers short & professional
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${envVars.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  },

  async searchWithAI(query: string) {
    const response = await axios.post(
      OPENROUTER_API,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are an AI classifier.

Return ONLY JSON.

Allowed categories:
- Criminal Law
- Family Law
- Tax Law
- Immigration Law
- Corporate Law
- Property Law

Format:
{
  "type": "lawyer_search",
  "category": "Criminal Law"
}

Rules:
- Must match EXACT category names
- No explanation
            `,
          },
          {
            role: "user",
            content: query,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${envVars.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  },
};
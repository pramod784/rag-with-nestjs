
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class RerankService {
  private openai = new OpenAI({
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}`,
    apiKey: process.env.AZURE_OPENAI_KEY
  });
  async rerank(query: string, docs: any[],stream = false) {
    const context = docs.map((d, i) => `Doc ${i+1}: ${d.content}`).join("\n\n");

    if (stream) {
      return this.openai.chat.completions.create({
        model: `${process.env.AZURE_OPENAI_MODEL}`,
        messages: [
          { role: "system", content: "Rank documents by relevance and return best answer." },
          { role: "user", content: `${query}\n\n${context}` }
        ],
        stream: true
      });
    }


    const completion = await this.openai.chat.completions.create({
      model: `${process.env.AZURE_OPENAI_MODEL}`,
      messages: [
        { role: "system", content: "Rank documents by relevance and return best answer." },
        { role: "user", content: `${query}\n\n${context}` }
      ]
    });

    return completion.choices[0].message;
  }
}


import { Injectable } from '@nestjs/common';
//import Redis from 'ioredis';
import OpenAI from 'openai';
import { AzureSearchService } from './services/azure-search.service';
import { IntentService } from './services/intent.service';
import { RuleEngineService } from './services/rule-engine.service';
import { RerankService } from './services/rerank.service';

@Injectable()
export class RagService {
  //private redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  private openai = new OpenAI({
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}`,
    apiKey: process.env.AZURE_OPENAI_KEY
  });

  constructor(
    private azureSearch: AzureSearchService,
    private intentService: IntentService,
    private ruleEngine: RuleEngineService,
    private rerankService: RerankService
  ) {}

  async handleChat(query: string, tenant: string,stream = false) {
    const cacheKey = `${tenant}:${query}`;
    //const cached = await this.redis.get(cacheKey);
    //if (cached) return JSON.parse(cached);

    const intent = this.intentService.detectIntent(query);

    const embedding = await this.openai.embeddings.create({
      model: `${process.env.AZURE_EMBEDDING_MODEL}`,
      input: query
    });

    const filter = this.ruleEngine.buildFilter(intent, tenant);
    const orderBy = this.ruleEngine.buildOrder(intent);

    const docs = await this.azureSearch.hybridSearch(
      query,
      embedding.data[0].embedding,
      filter,
      orderBy
    );

    if (stream) {
      return this.rerankService.rerank(query, docs, true);
    }

    const response = await this.rerankService.rerank(query, docs);

    //await this.redis.set(cacheKey, JSON.stringify(response), "EX", 300);

    return response;
  }
}

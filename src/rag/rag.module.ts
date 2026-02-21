
import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { AzureSearchService } from './services/azure-search.service';
import { IntentService } from './services/intent.service';
import { RuleEngineService } from './services/rule-engine.service';
import { RerankService } from './services/rerank.service';

@Module({
  controllers: [RagController],
  providers: [
    RagService,
    AzureSearchService,
    IntentService,
    RuleEngineService,
    RerankService
  ],
})
export class RagModule {}

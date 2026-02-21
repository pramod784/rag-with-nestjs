
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntentService {
  detectIntent(query: string) {
    const lower = query.toLowerCase();
    console.log("IntentService.detectIntent - query:", query);
    return {
      wantsLatest: lower.includes("latest") || lower.includes("recent"),
      contentType: lower.includes("policy") ? "policySearch"
        : lower.includes("article") ? "article"
        : undefined
    };
  }
}

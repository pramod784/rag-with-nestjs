
import { Injectable } from '@nestjs/common';

@Injectable()
export class RuleEngineService {

  buildFilter(intent: any, tenant: string, author?: string) {
    //let filters = [`tenantId eq '${tenant}'`];
    let filters = [];
    if (intent.contentType) {
      filters.push(`content_type eq '${intent.contentType}'`);
    }

    if (author) {
      filters.push(`author eq '${author}'`);
    }

    return filters.join(" and ");
  }

  buildOrder(intent: any) {
    if (intent.wantsLatest) {
      return "createdAt desc";
    }
    return undefined;
  }
}

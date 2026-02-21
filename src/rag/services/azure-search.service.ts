
import { Injectable } from '@nestjs/common';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

@Injectable()
export class AzureSearchService {
  private client: SearchClient<any>;

  constructor() {
    this.client = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      process.env.AZURE_SEARCH_INDEX!,
      new AzureKeyCredential(process.env.AZURE_SEARCH_KEY!)
    );
  }

  async hybridSearch(
    query: string,
    embedding: number[],
    filter?: string,
    orderBy?: string
  ) {
    console.log("AzureSearchService: hybridSearch called with filter:", filter);
    const results = await this.client.search(query, {
      // Enable semantic ranking
      queryType: "semantic",
      semanticSearchOptions: {
        configurationName: "rag-idx-mlone-search-semantic-configuration",
        //  Extractive answers (optional)
        captions: { captionType:"extractive" },
        answers: { answerType: "extractive" } ,
      },
      // Vector search
      vectorSearchOptions: {
        queries: [
          {
            vector: embedding,
            kNearestNeighborsCount: 10,
            fields: ["text_vector"],
            kind: "vector" // or "hybrid" for combined text + vector search
          }
        ]
      },

      // Optional filtering
      filter,

      // orderBy: orderBy ? [orderBy] : undefined,
      top: 10
    });

    const docs = [];
    for await (const result of results.results) {
      docs.push(result.document);
    }
    console.log("----------------------------------------");
    console.log("docs count:", docs.length);
    return docs;
  }
}

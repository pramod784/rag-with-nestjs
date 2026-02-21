
import { Controller, Post, Body, Headers , Response} from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('chat')
export class RagController {

  constructor(private readonly ragService: RagService) {}

  @Post()
  async chat(@Body() body: { query: string, stream?: boolean }, @Headers('x-tenant-id') tenant: string) {
    return this.ragService.handleChat(body.query, tenant, body.stream? true : false);
  }

  @Post("ask")
  async ask(
    @Body() body: { query: string; stream?: boolean },
    @Headers("x-tenant-id") tenant: string,
    @Response() res: Response
  ) {
    const { query, stream } = body;

    //if (!stream) {
      return await this.ragService.handleChat(query, tenant, false);
   // }
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class DrawsService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LibraryService {
  private readonly libraryUrl =
    process.env.LIBRARY_SERVICE_URL || 'http://localhost:3003';

  async findByUserId(userId: string, authorization?: string, groups: string[] = []) {
    const response = await axios.get(`${this.libraryUrl}/v1/biblioteca`, {
      headers: {
        'x-user-sub': userId,
        'x-user-groups': groups.join(','),
        Authorization: authorization ?? '',
      },
    });

    return response.data;
  }
}

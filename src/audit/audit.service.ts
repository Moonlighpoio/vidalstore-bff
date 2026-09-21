import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuditService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3003';

  async findAll(sub: string, groups: string[]) {
    const response = await axios.get(`${this.libraryUrl}/v1/auditoria`, {
      headers: {
        'x-user-sub': sub,
        'x-user-groups': groups.join(','),
      },
    });
    return response.data;
  }
}
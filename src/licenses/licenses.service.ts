import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LicensesService {
  private readonly libraryUrl =
    process.env.LIBRARY_SERVICE_URL || 'http://localhost:3003';

  private headers(sub: string, groups: string[], authorization?: string) {
    return {
      'x-user-sub': sub,
      'x-user-groups': groups.join(','),
      Authorization: authorization ?? '',
    };
  }

  async findAll(sub: string, groups: string[], authorization?: string) {
    const response = await axios.get(`${this.libraryUrl}/v1/licencias`, {
      headers: this.headers(sub, groups, authorization),
    });
    return response.data;
  }

  async revoke(
    licenciaId: string,
    revokedBy: string,
    groups: string[],
    authorization?: string,
  ) {
    const response = await axios.delete(
      `${this.libraryUrl}/v1/licencias/${licenciaId}`,
      {
        headers: this.headers(revokedBy, groups, authorization),
      },
    );
    return response.data;
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LicensesService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3003';

  async findAll() {
    const response = await axios.get(`${this.libraryUrl}/v1/licencias`, {
      headers: {
        'x-user-sub': 'admin',
        'x-user-groups': 'administradores',
      },
    });
    return response.data;
  }

  async revoke(licenciaId: string, revokedBy: string) {
    const response = await axios.delete(`${this.libraryUrl}/v1/licencias/${licenciaId}`, {
      headers: {
        'x-user-sub': revokedBy,
        'x-user-groups': 'administradores',
      },
    });
    return response.data;
  }
}
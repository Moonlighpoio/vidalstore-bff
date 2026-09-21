import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LibraryService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3003';

  async findByUserId(userId: string) {
    try {
      const response = await axios.get(`${this.libraryUrl}/v1/biblioteca`, {
        headers: {
          'x-user-sub': userId,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo biblioteca:', error.message);
      return [];
    }
  }
}
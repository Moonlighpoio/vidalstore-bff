import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PurchaseService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL || 'http://localhost:3003';

  async createPurchase(userId: string, body: any) {
    const gameId = body?.gameId || body;

    const response = await axios.post(
      `${this.libraryUrl}/v1/compras`,
      { gameId },
      {
        headers: {
          'x-user-sub': userId,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
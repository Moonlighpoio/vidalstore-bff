import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchaseService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL;

  createPurchase(userId: string, body: unknown) {
    // TODO: llamar al microservicio de biblioteca para crear licencia
    return {
      message: 'PurchaseService.createPurchase not implemented',
      userId,
      body,
    };
  }
}
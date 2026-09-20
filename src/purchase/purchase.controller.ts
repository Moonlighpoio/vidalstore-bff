import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('v1/compras')
export class PurchaseController {
  @Post()
  async createPurchase(
    @Body() body: any,
    @Headers('x-authenticated-sub') subject: string,
    @Headers('authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization header is required',
      );
    }

    if (!subject) {
      throw new UnauthorizedException(
        'Authenticated subject is required',
      );
    }

    return this.createPurchaseLogic(body, subject);
  }

  private createPurchaseLogic(body: any, subject: string) {
    // Tu lógica actual - subject es el usuario que compra
    return { purchased: true, user: subject, data: body };
  }
}
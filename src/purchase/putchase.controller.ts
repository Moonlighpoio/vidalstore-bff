import {
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PurchaseService } from './purchase.service';
import { AuthenticatedUser } from '../auth/auth.types';

@Controller('v1/compras')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  createPurchase(@Body() body: unknown, @Req() request: Request) {
    const user = request.user as AuthenticatedUser;

    return this.purchaseService.createPurchase(user.sub, body);
  }
}
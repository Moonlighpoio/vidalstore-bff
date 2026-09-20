import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { BffAuthGuard } from '../auth/auth.guard';
import { PurchaseService } from './purchase.service';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    groups: string[];
  };
}

@Controller('v1/compras')
@UseGuards(BffAuthGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    const userSub = req.user?.sub;
    
    if (!userSub) {
      throw new Error('User sub not found');
    }

    return this.purchaseService.createPurchase(userSub, body);
  }
}
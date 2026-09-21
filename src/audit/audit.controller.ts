import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { BffAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AuditService } from './audit.service';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    groups: string[];
  };
}

@Controller('v1/auditoria')
@UseGuards(BffAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('administradores')
  findAll(@Req() req: AuthenticatedRequest) {
    const sub = req.user?.sub;

    if (!sub) {
      throw new Error('Authenticated subject is required');
    }

    return this.auditService.findAll(sub, req.user?.groups ?? []);
  }
}
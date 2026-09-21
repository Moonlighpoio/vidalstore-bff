import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { BffAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { LicensesService } from './licenses.service';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    groups: string[];
  };
}

@Controller('v1/licencias')
@UseGuards(BffAuthGuard)
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get()
  @Roles('administradores')
  findAll(@Req() req: AuthenticatedRequest) {
    const sub = req.user?.sub;

    if (!sub) {
      throw new Error('Authenticated subject is required');
    }

    return this.licensesService.findAll(sub, req.user?.groups ?? []);
  }

  @Delete(':id')
  @Roles('administradores')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const adminSub = req.user?.sub;

    if (!adminSub) {
      throw new Error('Admin sub not found');
    }

    return this.licensesService.revoke(id, adminSub, req.user?.groups ?? []);
  }
}
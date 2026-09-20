import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { BffAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { AuditService } from './audit.service';

@Controller('v1/auditoria')
@UseGuards(BffAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('administradores')
  findAll() {
    return this.auditService.findAll();
  }
}
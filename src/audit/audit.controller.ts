import { Controller, Get } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditRecord } from './audit.types';

@Controller('internal/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(): AuditRecord[] {
    return this.auditService.findAll();
  }
}
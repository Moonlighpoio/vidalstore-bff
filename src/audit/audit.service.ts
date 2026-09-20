import { Injectable } from '@nestjs/common';
import { AuditRecord } from './audit.types';

@Injectable()
export class AuditService {
  private records: AuditRecord[] = [];

  create(record: Omit<AuditRecord, 'id'>): AuditRecord {
    const newRecord: AuditRecord = {
      ...record,
      id: crypto.randomUUID(),
    };
    this.records.push(newRecord);
    return newRecord;
  }

  findAll(): AuditRecord[] {
    return this.records;
  }

  findByLicenseId(licenseId: string): AuditRecord[] {
    return this.records.filter((r) => r.licenseId === licenseId);
  }
}
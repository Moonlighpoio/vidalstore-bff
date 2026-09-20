import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('v1/auditoria')
export class AuditController {
  @Get()
  async getAuditoria(
    @Headers('x-authenticated-sub') subject: string,
    @Headers('x-authenticated-groups') groups: string,
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

    const groupsArray = groups ? groups.split(',') : [];

    if (!groupsArray.includes('administradores')) {
      throw new UnauthorizedException(
        'Insufficient permissions',
      );
    }

    return this.getAuditLog();
  }

  private getAuditLog() {
    // Tu lógica actual
    return [];
  }
}
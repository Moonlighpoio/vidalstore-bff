import {
  Controller,
  Get,
  Delete,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('v1/licencias')
export class LicensesController {
  @Get()
  async getLicencias(
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

    return this.getAllLicenses();
  }

  @Delete(':licenciaId')
  async revokeLicense(
    @Param('licenciaId') licenciaId: string,
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

    return this.revokeLicenseLogic(licenciaId, subject);
  }

  private getAllLicenses() {
    // Tu lógica actual
    return [];
  }

  private revokeLicenseLogic(licenciaId: string, subject: string) {
    // Tu lógica actual - subject es el administrador que revoca
    return { revoked: true, licenciaId, revokedBy: subject };
  }
}
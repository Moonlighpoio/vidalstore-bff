import { Injectable } from '@nestjs/common';

@Injectable()
export class LicensesService {
  private readonly libraryUrl = process.env.LIBRARY_SERVICE_URL;

  findAll() {
    // TODO: llamar al microservicio de biblioteca para listar todas las licencias
    return { message: 'LicensesService.findAll not implemented' };
  }

  revoke(licenciaId: string, revokedBy: string) {
    // TODO: llamar al microservicio de biblioteca para revocar licencia
    // TODO: registrar en auditoría
    return {
      message: 'LicensesService.revoke not implemented',
      licenciaId,
      revokedBy,
    };
  }
}
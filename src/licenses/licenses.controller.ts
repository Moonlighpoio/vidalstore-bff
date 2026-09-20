import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LicensesService } from './licenses.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/licencias')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get()
  @Roles('administradores')
  findAllLicenses() {
    return this.licensesService.findAll();
  }

  @Delete(':licenciaId')
  @Roles('administradores')
  revokeLicense(
    @Param('licenciaId') licenciaId: string,
    @Req() request: Request,
  ) {
    const user = request.user as AuthenticatedUser;

    return this.licensesService.revoke(licenciaId, user.sub);
  }
}
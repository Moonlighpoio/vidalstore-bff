import {
  Controller,
  Get,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LibraryService } from './library.service';
import { AuthenticatedUser } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/biblioteca')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  findOwnLibrary(@Req() request: Request) {
    const user = request.user as AuthenticatedUser;

    return this.libraryService.findByUserId(user.sub);
  }

  @Get('todas')
  @Roles('administradores')
  findAllLibraries() {
    // TODO: implementar en el servicio
    return { message: 'Lista de todas las bibliotecas (solo administradores)' };
  }
}
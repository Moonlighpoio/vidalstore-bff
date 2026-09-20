import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('v1/biblioteca')
export class LibraryController {
  @Get()
  async getBiblioteca(
    @Headers('x-authenticated-sub') subject: string,
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

    return this.getUserLibrary(subject);
  }

  private getUserLibrary(subject: string) {
    // Tu lógica actual - usa el subject para obtener la biblioteca del usuario
    return [];
  }
}
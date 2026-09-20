import {
  Controller,
  Get,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { LibraryService } from './library.service';
import { AuthenticatedUser } from '../auth/auth.types';

@Controller('v1/biblioteca')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  findOwnLibrary(@Req() request: Request) {
    const user = request.user as AuthenticatedUser;

    return this.libraryService.findByUserId(user.sub);
  }
}
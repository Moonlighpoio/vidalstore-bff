import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { BffAuthGuard } from '../auth/auth.guard';
import { LibraryService } from './library.service';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    groups: string[];
  };
}

@Controller('v1/biblioteca')
@UseGuards(BffAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const userSub = req.user?.sub;
    
    if (!userSub) {
      throw new Error('User sub not found');
    }

    return this.libraryService.findByUserId(userSub);
  }
}
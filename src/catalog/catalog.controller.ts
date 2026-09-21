import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { Roles } from '../auth/roles.decorator';
import { BffAuthGuard } from '../auth/auth.guard';
import { CatalogService } from './catalog.service';

@Controller('v1/catalogo')
@UseGuards(BffAuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  private authorization(req: Request): string | undefined {
    return req.headers.authorization;
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.catalogService.findAll(this.authorization(req));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.catalogService.findOne(id, this.authorization(req));
  }

  @Post()
  @Roles('editores', 'administradores')
  create(@Body() body: unknown, @Req() req: Request) {
    return this.catalogService.create(body, this.authorization(req));
  }

  @Put(':id')
  @Roles('editores', 'administradores')
  update(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: Request,
  ) {
    return this.catalogService.update(id, body, this.authorization(req));
  }
}
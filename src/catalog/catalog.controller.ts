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
import {
  CatalogService,
  CatalogProxyHeaders,
} from './catalog.service';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    groups: string[];
  };
}

@Controller('v1/catalogo')
@UseGuards(BffAuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  private proxyHeaders(req: AuthenticatedRequest): CatalogProxyHeaders {
    return {
      authorization: req.headers.authorization,
      sub: req.user?.sub,
      groups: req.user?.groups,
    };
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.catalogService.findAll(this.proxyHeaders(req));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.catalogService.findOne(id, this.proxyHeaders(req));
  }

  @Post()
  @Roles('editores', 'administradores')
  create(@Body() body: unknown, @Req() req: AuthenticatedRequest) {
    return this.catalogService.create(body, this.proxyHeaders(req));
  }

  @Put(':id')
  @Roles('editores', 'administradores')
  update(
    @Param('id') id: string,
    @Body() body: unknown,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.catalogService.update(id, body, this.proxyHeaders(req));
  }
}
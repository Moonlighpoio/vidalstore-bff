import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { CatalogService } from './catalog.service';

@Controller('v1/catalogo')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogService.findOne(id);
  }

  @Post()
  @Roles('editores', 'administradores')
  create(@Body() body: unknown) {
    return this.catalogService.create(body);
  }

  @Put(':id')
  @Roles('editores', 'administradores')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.catalogService.update(id, body);
  }
}
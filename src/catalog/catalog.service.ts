import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  private readonly catalogUrl = process.env.CATALOG_SERVICE_URL;

  findAll() {
    // TODO: llamar al microservicio de catálogo
    return { message: 'CatalogService.findAll not implemented' };
  }

  findOne(id: string) {
    // TODO: llamar al microservicio de catálogo
    return { message: 'CatalogService.findOne not implemented', id };
  }

  create(body: unknown) {
    // TODO: llamar al microservicio de catálogo
    return { message: 'CatalogService.create not implemented', body };
  }

  update(id: string, body: unknown) {
    // TODO: llamar al microservicio de catálogo
    return { message: 'CatalogService.update not implemented', id, body };
  }
}
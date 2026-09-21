import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface CatalogProxyHeaders {
  authorization?: string;
  sub?: string;
  groups?: string[];
}

@Injectable()
export class CatalogService {
  private readonly catalogUrl =
    process.env.CATALOG_SERVICE_URL || 'http://localhost:8001';

  private headers(headers: CatalogProxyHeaders) {
    return {
      Authorization: headers.authorization ?? '',
      'x-user-sub': headers.sub ?? '',
      'x-user-groups': (headers.groups ?? []).join(','),
      'Content-Type': 'application/json',
    };
  }

  async findAll(headers: CatalogProxyHeaders) {
    const response = await axios.get(`${this.catalogUrl}/v1/catalogo`, {
      headers: this.headers(headers),
    });

    return response.data;
  }

  async findOne(id: string, headers: CatalogProxyHeaders) {
    const response = await axios.get(
      `${this.catalogUrl}/v1/catalogo/${encodeURIComponent(id)}`,
      { headers: this.headers(headers) },
    );

    return response.data;
  }

  async create(body: unknown, headers: CatalogProxyHeaders) {
    const response = await axios.post(
      `${this.catalogUrl}/v1/catalogo`,
      body,
      { headers: this.headers(headers) },
    );

    return response.data;
  }

  async update(id: string, body: unknown, headers: CatalogProxyHeaders) {
    const response = await axios.put(
      `${this.catalogUrl}/v1/catalogo/${encodeURIComponent(id)}`,
      body,
      { headers: this.headers(headers) },
    );

    return response.data;
  }
}
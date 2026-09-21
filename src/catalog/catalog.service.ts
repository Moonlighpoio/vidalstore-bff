import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CatalogService {
  private readonly catalogUrl =
    process.env.CATALOG_SERVICE_URL || 'http://localhost:8001';

  private headers(authorization?: string) {
    return {
      Authorization: authorization ?? '',
      'Content-Type': 'application/json',
    };
  }

  async findAll(authorization?: string) {
    const response = await axios.get(`${this.catalogUrl}/v1/catalogo`, {
      headers: this.headers(authorization),
    });

    return response.data;
  }

  async findOne(id: string, authorization?: string) {
    const response = await axios.get(
      `${this.catalogUrl}/v1/catalogo/${encodeURIComponent(id)}`,
      { headers: this.headers(authorization) },
    );

    return response.data;
  }

  async create(body: unknown, authorization?: string) {
    const response = await axios.post(
      `${this.catalogUrl}/v1/catalogo`,
      body,
      { headers: this.headers(authorization) },
    );

    return response.data;
  }

  async update(id: string, body: unknown, authorization?: string) {
    const response = await axios.put(
      `${this.catalogUrl}/v1/catalogo/${encodeURIComponent(id)}`,
      body,
      { headers: this.headers(authorization) },
    );

    return response.data;
  }
}
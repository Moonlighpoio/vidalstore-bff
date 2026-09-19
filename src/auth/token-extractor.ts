import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export function extractBearerToken(request: Request): string {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedException('Authorization header is required');
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedException('Authorization header must use Bearer scheme');
  }

  return token;
}
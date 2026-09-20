import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { extractBearerToken } from './token-extractor';
import { AuthenticatedUser } from './auth.types';

@Injectable()
export class BffAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    extractBearerToken(request);

    const sub = request.headers['x-user-sub'];
    const groupsHeader = request.headers['x-user-groups'];
    const clientId = request.headers['x-client-id'];
    const tokenUse = request.headers['x-token-use'];
    const scope = request.headers['x-scope'];

    if (!sub || typeof sub !== 'string') {
      throw new UnauthorizedException(
        'Authenticated subject is required',
      );
    }

    const groups =
      typeof groupsHeader === 'string'
        ? groupsHeader
            .split(',')
            .map((group) => group.trim())
            .filter(Boolean)
        : [];

    const user: AuthenticatedUser = {
      sub,
      groups,
      clientId:
        typeof clientId === 'string' ? clientId : undefined,
      tokenUse: tokenUse === 'access' ? 'access' : undefined,
      scope: typeof scope === 'string' ? scope : undefined,
    };

    request.user = user;

    return true;
  }
}
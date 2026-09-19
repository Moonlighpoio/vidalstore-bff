import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { BffAuthGuard } from './auth.guard';

function createContext(headers: Record<string, string>): ExecutionContext {
  const request = {
    headers,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

describe('BffAuthGuard', () => {
  let guard: BffAuthGuard;

  beforeEach(() => {
    guard = new BffAuthGuard();
  });

  it('allows a request with valid authentication context', () => {
    const context = createContext({
      authorization: 'Bearer access-token',
      'x-user-sub': 'user-123',
      'x-user-groups': 'jugadores',
      'x-token-use': 'access',
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects a request without authorization header', () => {
    const context = createContext({
      'x-user-sub': 'user-123',
      'x-user-groups': 'jugadores',
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('rejects a request without subject', () => {
    const context = createContext({
      authorization: 'Bearer access-token',
      'x-user-groups': 'jugadores',
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('attaches the authenticated user to the request', () => {
    const request = {
      headers: {
        authorization: 'Bearer access-token',
        'x-user-sub': 'user-123',
        'x-user-groups': 'jugadores,editores',
        'x-client-id': 'client-123',
        'x-token-use': 'access',
        'x-scope': 'vidalstore/catalogo.leer',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({
      sub: 'user-123',
      groups: ['jugadores', 'editores'],
      clientId: 'client-123',
      tokenUse: 'access',
      scope: 'vidalstore/catalogo.leer',
    });
  });
});
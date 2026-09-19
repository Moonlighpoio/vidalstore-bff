export interface AuthenticatedUser {
  sub: string;
  clientId?: string;
  tokenUse?: 'access';
  scope?: string;
  groups: string[];
}
export interface AuthenticatedRequestContext {
  sub: string;
  clientId?: string;
  tokenUse?: 'access';
  scope?: string;
  groups: string[];
}

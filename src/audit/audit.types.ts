export interface AuditRecord {
  id: string;
  action: 'LICENSE_REVOKED';
  actorSub: string;
  targetUserSub: string;
  gameId: string;
  licenseId: string;
  timestamp: string;
}
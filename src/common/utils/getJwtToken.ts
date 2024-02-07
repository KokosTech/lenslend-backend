import { Request } from 'express';

export const getJwtToken = (request: Request): string | null => {
  const authHeaders = request.headers.authorization;
  const [type, token] = authHeaders?.split(' ') ?? [];
  return type === 'Bearer' ? token : null;
};

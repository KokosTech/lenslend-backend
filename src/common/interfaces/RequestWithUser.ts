import { User } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: User;
}

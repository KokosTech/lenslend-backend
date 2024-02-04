import { User } from '@prisma/client';

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithParamUuid {
  params: {
    uuid: string;
  };
}

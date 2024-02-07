import { Status } from '@prisma/client';

export const commonWhereClause = {
  status: Status.PUBLIC,
  deleted_at: null,
  user: {
    deleted_at: null,
  },
};

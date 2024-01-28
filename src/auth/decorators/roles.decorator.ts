import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);

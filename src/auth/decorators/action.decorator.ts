import { SetMetadata } from '@nestjs/common';

export const Action = (...args: ('view' | 'manage')[]) =>
  SetMetadata('action', args);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Pagination } from '../pagination';
import { PaginationRequest } from '../interfaces/PaginationRequest';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Pagination => {
    const request: PaginationRequest = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 10;
    return new Pagination(page, limit);
  },
);

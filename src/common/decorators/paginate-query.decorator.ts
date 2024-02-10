import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiQueryPaginated = (page = 1, limit = 10) =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      example: page,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: limit,
    }),
  );

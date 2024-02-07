import { ApiParam } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiParamPaginated = (page = 1, limit = 10) =>
  applyDecorators(
    ApiParam({
      name: 'page',
      required: false,
      example: page,
    }),
    ApiParam({
      name: 'limit',
      required: false,
      example: limit,
    }),
  );

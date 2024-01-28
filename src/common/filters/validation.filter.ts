import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly i18nCommonErrorsFile = 'common-errors';

  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { errors } = exception;

    console.log(exception);

    response.status(HttpStatus.BAD_REQUEST).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation Error',
      data: null,
      errors,
    });
  }
}

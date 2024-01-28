import {
  ArgumentsHost,
  Catch,
  ExceptionFilter as _ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionsFilter implements _ExceptionFilter {
  private readonly logger = new Logger('ExceptionHandler');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code: string;
    let message: string;
    let statusCode: HttpStatus;

    if (exception instanceof NotFoundException) {
      statusCode = HttpStatus.NOT_FOUND;
      code = 'NOT_FOUND';
      message = 'Not Found';
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resp = exception.getResponse() as HttpExceptionBody & {
        code: string;
      };

      // eslint-disable-next-line prefer-destructuring
      code = resp.code;
      message = resp.message as string;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_SERVER_ERROR';
      message = 'Internal Server Error';

      if (exception instanceof Error) {
        this.logger.error(`${exception.message} ${exception.stack}`);
      }
    }

    response.status(statusCode).json({
      code,
      statusCode,
      message,
      data: null,
      errors: null,
    });
  }
}

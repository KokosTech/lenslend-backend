import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Gets the request log
    console.log('req:', {
      headers: req.headers,
      body: req.body,
      url: req.url,
    });
    if (next) {
      next();
    }
  }
}

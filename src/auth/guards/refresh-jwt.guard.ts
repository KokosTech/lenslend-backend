/* eslint-disable */
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtGuard extends AuthGuard('jwt-refresh') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status: any,
  ) {
    if (info instanceof Error) {
      throw new UnauthorizedException({
        errorCode: 'INVALID_REFRESH_TOKEN',
      });
    }

    return super.handleRequest(err, user, info, context, status);
  }
}

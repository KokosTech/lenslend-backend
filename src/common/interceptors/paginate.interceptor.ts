import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationResultDto } from '../dtos/pagination.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, PaginationResultDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<PaginationResultDto<T>> {
    return next.handle().pipe(
      map((data): PaginationResultDto<T> => {
        if (data instanceof PaginationResultDto) {
          return data as PaginationResultDto<T>;
        }

        const items: T[] = Array.isArray(data) ? data : [data as unknown as T];
        return new PaginationResultDto<T>(items, 1, 10, items.length);
      }),
    );
  }
}

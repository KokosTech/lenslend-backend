import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ListingModule } from './listing/listing.module';
import { LoggerMiddleware } from './logger.middleware';
import { PlaceModule } from './place/place.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { SearchModule } from './search/search.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from './common/filters/exceptions.filter';
import { ValidationExceptionFilter } from './common/filters/validation.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { FileModule } from './file/file.module';
import { ListingService } from './listing/listing.service';
import { ReviewModule } from './place/review/review.module';
import { CommentModule } from './listing/comment/comment.module';
import { JwtModule } from '@nestjs/jwt';
import { PlaceService } from './place/place.service';
import { CommentService } from './listing/comment/comment.service';
import { ReviewService } from './place/review/review.service';
import { ResourceService } from './resource/resource.service';
import { ResourceModule } from './resource/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    ListingModule,
    PlaceModule,
    ChatModule,
    CategoryModule,
    CommentModule,
    ReviewModule,
    TagModule,
    SearchModule,
    MailModule,
    FileModule,
    JwtModule,
    ResourceModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    MailService,
    ListingService,
    PlaceService,
    CommentService,
    ReviewService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: FormatResponseInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    ResourceService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

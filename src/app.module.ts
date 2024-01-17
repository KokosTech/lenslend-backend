import {
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

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    ListingModule,
    PlaceModule,
    ChatModule,
    CategoryModule,
    TagModule,
    SearchModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

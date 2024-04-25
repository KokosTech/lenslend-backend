import { forwardRef, Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { ReviewModule } from './review/review.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceModule } from './service/service.module';
import { AuthModule } from '../auth/auth.module';
import { ResourceModule } from '../resource/resource.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    ReviewModule,
    PrismaModule,
    ServiceModule,
    forwardRef(() => CategoryModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => ResourceModule),
  ],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}

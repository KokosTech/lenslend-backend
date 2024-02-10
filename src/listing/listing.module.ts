import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from '../auth/auth.module';
import { ResourceModule } from '../resource/resource.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    PrismaModule,
    CommentModule,
    ReportModule,
    ResourceModule,
    forwardRef(() => CategoryModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService],
})
export class ListingModule {}

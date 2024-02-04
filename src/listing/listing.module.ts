import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { TagModule } from '../tag/tag.module';
import { AuthModule } from '../auth/auth.module';
import { ResourceModule } from '../resource/resource.module';

@Module({
  imports: [
    PrismaModule,
    CommentModule,
    ReportModule,
    TagModule,
    ResourceModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService],
})
export class ListingModule {}

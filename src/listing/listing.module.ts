import { forwardRef, Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { TagModule } from '../tag/tag.module';
import { PlaceModule } from '../place/place.module';
import { ReviewModule } from '../place/review/review.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    CommentModule,
    ReportModule,
    TagModule,
    PlaceModule,
    ReviewModule,
    JwtModule,
  ],
  controllers: [ListingController],
  providers: [ListingService],
  exports: [ListingService],
})
export class ListingModule {}

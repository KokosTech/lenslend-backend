import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [PrismaModule, UserModule, CommentModule, ReportModule],
  controllers: [ListingController],
  providers: [ListingService],
})
export class ListingModule {}

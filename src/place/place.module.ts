import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { ReportModule } from './report/report.module';
import { ReviewModule } from './review/review.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceModule } from './service/service.module';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService],
  imports: [ReportModule, ReviewModule, PrismaModule, ServiceModule],
})
export class PlaceModule {}

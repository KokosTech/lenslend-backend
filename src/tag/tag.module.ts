import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TagController],
  providers: [TagService],
  imports: [PrismaModule],
  exports: [TagService],
})
export class TagModule {}

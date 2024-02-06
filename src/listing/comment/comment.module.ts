import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { ResourceModule } from '../../resource/resource.module';

@Module({
  imports: [
    PrismaModule,
    ResourceModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ResourceModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}

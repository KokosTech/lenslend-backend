import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ListingModule } from '../listing/listing.module';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ListingModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

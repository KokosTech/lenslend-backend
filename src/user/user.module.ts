import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ListingModule } from '../listing/listing.module';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';
import { PlaceModule } from '../place/place.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ListingModule),
    forwardRef(() => PlaceModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

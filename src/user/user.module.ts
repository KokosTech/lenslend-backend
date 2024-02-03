import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ListingModule } from '../listing/listing.module';

@Module({
  imports: [PrismaModule, forwardRef(() => ListingModule)],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

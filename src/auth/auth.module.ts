import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '../redis/redis.module';
import { env } from 'process';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserModule } from '../user/user.module';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

import { jwtConstants } from './constants';
import { ListingModule } from '../listing/listing.module';
import { PlaceModule } from '../place/place.module';
import { CommentModule } from '../listing/comment/comment.module';
import { OwnerGuard } from './guards/owner.guard';
import { ReviewModule } from '../place/review/review.module';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    RedisModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: env.NODE_ENV === 'development' ? '7d' : '7d',
      },
    }),
    ListingModule,
    PlaceModule,
    CommentModule,
    ReviewModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    OwnerGuard,
  ],
  controllers: [AuthController],
  exports: [passportModule],
})
export class AuthModule {}

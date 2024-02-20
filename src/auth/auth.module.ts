import { forwardRef, Module } from '@nestjs/common';
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
import { PermissionsGuard } from './guards/permissions-guard.service';
import { ResourceModule } from '../resource/resource.module';
import { ListingModule } from '../listing/listing.module';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    RedisModule,
    forwardRef(() => UserModule),
    forwardRef(() => ListingModule),
    PassportModule,
    ResourceModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: env.NODE_ENV === 'development' ? '1d' : '60s',
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    PermissionsGuard,
    ResourceModule,
  ],
  controllers: [AuthController],
  exports: [passportModule, AuthService],
})
export class AuthModule {}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ListingService } from '../../listing/listing.service';
import { CommentService } from '../../listing/comment/comment.service';
import { ReviewService } from '../../place/review/review.service';
import { PlaceService } from '../../place/place.service';
import { Role, Status, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenInterface } from '../interfaces/authToken.interface';
import { UserService } from '../../user/user.service';
import { jwtConstants } from '../constants';
import { RequestWithParamUuid } from '../../common/interfaces/RequestWithUser';
import { Request } from 'express';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly listingService: ListingService,
    private readonly placeService: PlaceService,
    private readonly commentService: CommentService,
    private readonly reviewService: ReviewService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  matchOwner(userId: string, ownerId: string) {
    return userId === ownerId;
  }

  getJwtToken(request: Request): string | null {
    const authHeaders = request.headers.authorization;
    const [type, token] = authHeaders?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  async getUserFromToken(token: string | null): Promise<User | null> {
    if (!token) {
      return null;
    }

    try {
      const { id }: AuthTokenInterface = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret,
        },
      );

      return this.userService.findByUUID(id);
    } catch {
      return null;
    }
  }

  async getUserFromRequest(
    request:
      | Request
      | {
          user: User;
        },
  ): Promise<User | null> {
    if ('user' in request && request.user && 'uuid' in request.user) {
      console.log('user in request');
      return request.user;
    }

    // if type is Request, then user is not in request

    console.log('user not in request');
    const token = this.getJwtToken(request as Request);
    return this.getUserFromToken(token);
  }

  async getObjectOwnerAndStatus(context: ExecutionContext): Promise<{
    ownerId: string;
    status: Status;
  } | null> {
    const resources = this.reflector.get<
      'listing' | 'place' | 'comment' | 'review'
    >('resource', context.getHandler());

    if (!resources) {
      return null;
    }

    const [resource] = resources as unknown as [
      'listing' | 'place' | 'comment' | 'review',
    ];

    const request: RequestWithParamUuid = context.switchToHttp().getRequest();
    const resourceId = request.params.uuid;

    switch (resource) {
      case 'listing':
        console.log('resourceId', resourceId);
        return this.listingService.findOneMeta(resourceId);
      case 'place':
        return this.placeService.findOneMeta(resourceId);
      // case 'comment':
      //   return this.commentService.findOneMeta(objectId);
      case 'review':
        return this.reviewService.findOneMeta(resourceId);
      default:
        return null;
    }
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  async canManage(
    context: ExecutionContext,
    resource: {
      ownerId: string;
      status: Status;
    },
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = await this.getUserFromRequest(request);

    if (!user) {
      throw new UnauthorizedException('Cannot manage object');
    }

    if (this.matchRoles([Role.ADMIN, Role.MOD], user.role)) {
      return true;
    }

    return this.matchOwner(user.uuid, resource.ownerId);
  }

  async canView(
    context: ExecutionContext,
    resource: {
      ownerId: string;
      status: Status;
    },
  ): Promise<boolean> {
    console.log('canView', resource);
    if (resource.status === Status.PUBLIC) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = await this.getUserFromRequest(request);

    console.log('user', user);

    if (!user) {
      return false;
    }

    if (this.matchRoles([Role.ADMIN, Role.MOD], user.role)) {
      return true;
    }

    return this.matchOwner(user.uuid, resource.ownerId);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('canActivate');
    const actions = this.reflector.get<'view' | 'manage'>(
      'action',
      context.getHandler(),
    );

    if (!actions) {
      return false;
    }

    const [action] = actions as unknown as ['view' | 'manage'];

    const resource = await this.getObjectOwnerAndStatus(context);

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    switch (action) {
      case 'manage':
        return this.canManage(context, resource);
      case 'view':
        return this.canView(context, resource);
      default:
        return false;
    }
  }
}

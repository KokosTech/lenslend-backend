import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, Status, User } from '@prisma/client';
import {
  RequestWithParamUuid,
  RequestWithUser,
} from '../../common/interfaces/RequestWithUser';
import { Request } from 'express';
import {
  ResourceContent,
  ResourceType,
} from '../../resource/types/resource.type';
import { ResourceService } from '../../resource/resource.service';
import { inArray } from '../../common/utils/inArray';
import { getJwtToken } from '../../common/utils/getJwtToken';
import { ActionType } from '../types/action.type';
import { AuthService } from '../auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly resourceService: ResourceService,
  ) {}

  private matchOwner(userId: string, ownerId: string) {
    return userId === ownerId;
  }

  private async getUserFromRequest(
    request: Request | RequestWithUser,
  ): Promise<User | null> {
    if ('user' in request && request.user && 'uuid' in request.user) {
      return request.user;
    }

    const token = getJwtToken(request as Request);
    return this.authService.getUserFromToken(token);
  }

  private async getObjectOwnerAndStatus(
    context: ExecutionContext,
  ): Promise<ResourceContent | null> {
    const [resource] = this.reflector.get<ResourceType[]>(
      'resource',
      context.getHandler(),
    );

    const request: RequestWithParamUuid = context.switchToHttp().getRequest();
    const resourceId = request.params.uuid;

    return this.resourceService.findOneMeta(resource, resourceId);
  }

  private async can(
    context: ExecutionContext,
    resource: ResourceContent,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = await this.getUserFromRequest(request);

    if (!user) {
      throw new UnauthorizedException(`Cannot manage object ${resource.uuid}`);
    }

    if (inArray([Role.ADMIN, Role.MOD], user.role)) {
      return true;
    }

    return this.matchOwner(user.uuid, resource.ownerId);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [action] = this.reflector.get<ActionType[]>(
      'action',
      context.getHandler(),
    );

    if (!action) {
      return false;
    }

    const resource = await this.getObjectOwnerAndStatus(context);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    switch (action) {
      case 'manage':
        return this.can(context, resource);
      case 'view':
        if (resource.status === Status.PUBLIC) return true;
        return this.can(context, resource);
      default:
        return false;
    }
  }
}

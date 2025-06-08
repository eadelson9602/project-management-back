import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { META_ROLES } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user) {
      throw new BadRequestException('No user found in request');
    }

    const hasRole = roles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `User ${user.name} does not have a required role: ${roles.join(', ')}`,
      );
    }

    return true;
  }
}

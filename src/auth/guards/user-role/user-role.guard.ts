import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { META_ROLS } from '../../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const roles = this.reflector.get<string[]>(META_ROLS, context.getHandler());
    const user = request.user as User;

    if (!roles) return true;
    if (roles.length == 0) return true;

    if (!user) throw new BadRequestException();

    for (const role of roles) {
      if (user.role == role) return true;
    }

    throw new ForbiddenException(
      `User ${user.name} need a valid role: ${roles.join(', ')}`,
    );
  }
}

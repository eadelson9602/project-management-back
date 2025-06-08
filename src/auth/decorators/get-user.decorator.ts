import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user || typeof user !== 'object' || !('id' in user)) {
      throw new InternalServerErrorException('Invalid user object in request');
    }

    if (typeof user.id !== 'string') {
      throw new InternalServerErrorException('Invalid user payload format');
    }

    if (data && typeof user[data] === 'undefined') {
      throw new InternalServerErrorException(
        `User property '${data}' not found`,
      );
    }
    return data ? user[data] : user;
  },
);

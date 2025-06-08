import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const SoftDelete = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const softDeleteParam = request.query['softDelete'];
    return softDeleteParam === 'true';
  },
);

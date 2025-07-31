import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export const handleDBExceptions = (error: QueryFailedError) => {
  const driverError = error.driverError as unknown as {
    detail: string;
    message: string;
  };

  if (driverError.detail) {
    throw new BadRequestException(driverError.detail);
  } else {
    throw new InternalServerErrorException(error.message);
  }
};

import { IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UserFiltersDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}

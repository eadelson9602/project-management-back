import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsEnum,
  IsEmail,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
}

export class UserFiltersDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: 'IsActive must be a boolean value' })
  isActive?: boolean;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Invalid role value. Must be: admin, manager, or developer',
  })
  role?: UserRole;

  @IsOptional()
  @IsUUID(4, { message: 'Project ID must be a valid UUID v4' })
  projectId?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Task ID must be a valid UUID v4' })
  taskId?: string;

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

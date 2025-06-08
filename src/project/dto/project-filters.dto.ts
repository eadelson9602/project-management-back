import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsEnum,
  IsUUID,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class ProjectFiltersDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Min(1, { message: 'Name must be at least 1 character long' })
  @Max(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Min(1, { message: 'Description must be at least 1 character long' })
  @Max(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus, {
    message:
      'Invalid status value. Must be: planning, in_progress, completed, or cancelled',
  })
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority, {
    message: 'Invalid priority value. Must be: low, medium, or high',
  })
  priority?: ProjectPriority;

  @IsOptional()
  @IsBoolean({ message: 'IsActive must be a boolean value' })
  isActive?: boolean;

  @IsOptional()
  @IsUUID(4, { message: 'Manager ID must be a valid UUID v4' })
  managerId?: string;

  @IsOptional()
  @IsArray({ message: 'Developers IDs must be an array' })
  @ArrayMinSize(1, { message: 'At least one developer ID is required' })
  @ArrayMaxSize(100, { message: 'Cannot filter by more than 100 developers' })
  @IsUUID(4, {
    each: true,
    message: 'Each developer ID must be a valid UUID v4',
  })
  developersIds?: string[];

  @IsOptional()
  @IsDate({ message: 'Created at must be a valid date' })
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Updated at must be a valid date' })
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsDate({ message: 'Deleted at must be a valid date' })
  @Type(() => Date)
  deletedAt?: Date;
}

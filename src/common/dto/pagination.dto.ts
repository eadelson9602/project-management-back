import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsString,
  ValidateNested,
  IsArray,
  IsUUID,
  IsIn,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterDto {
  @IsOptional()
  @IsArray({ message: 'Status must be an array' })
  @ArrayUnique({ message: 'Status values must be unique' })
  @IsIn(['todo', 'in_progress', 'review', 'done'], {
    each: true,
    message:
      'Invalid status value. Must be: todo, in_progress, review, or done',
  })
  status?: string[];

  @IsOptional()
  @IsArray({ message: 'Priority must be an array' })
  @ArrayUnique({ message: 'Priority values must be unique' })
  @IsIn(['low', 'medium', 'high'], {
    each: true,
    message: 'Invalid priority value. Must be: low, medium, or high',
  })
  priority?: string[];

  @IsOptional()
  @IsUUID(4, { message: 'Assigned to ID must be a valid UUID v4' })
  assignedTo?: string;

  @IsOptional()
  @IsUUID(4, { message: 'Project ID must be a valid UUID v4' })
  projectId?: string;
}

export class PaginationDto {
  @IsInt({ message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  @Max(1000, { message: 'Page cannot exceed 1000' })
  page: number = 1;

  @IsInt({ message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(100, { message: 'Limit cannot exceed 100 items per page' })
  limit: number = 10;

  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterDto)
  filters?: FilterDto;

  @IsOptional()
  @IsString({ message: 'Sort field must be a valid column name' })
  @IsIn(['title', 'status', 'priority', 'createdAt', 'updatedAt'], {
    message:
      'Invalid sort field. Must be: title, status, priority, createdAt, or updatedAt',
  })
  sortField?: string;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be either ASC or DESC' })
  sortOrder?: SortOrder = SortOrder.ASC;
}

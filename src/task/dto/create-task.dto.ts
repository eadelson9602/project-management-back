import {
  IsUUID,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @Min(1, { message: 'Title must be at least 1 character long' })
  @Max(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @Min(1, { message: 'Description must be at least 1 character long' })
  @Max(500, { message: 'Description cannot exceed 500 characters' })
  description: string;

  @IsEnum(['todo', 'in_progress', 'review', 'done'], {
    message:
      'Invalid status value. Must be: todo, in_progress, review, or done',
  })
  status: string;

  @IsEnum(['low', 'medium', 'high'], {
    message: 'Invalid priority value. Must be: low, medium, or high',
  })
  priority: string;

  @IsNumber({}, { message: 'Estimated hours must be a number' })
  @Min(0.1, { message: 'Estimated hours must be greater than 0' })
  @Max(168, { message: 'Estimated hours cannot exceed 168 hours (1 week)' })
  estimatedHours: number;

  @IsNumber({}, { message: 'Actual hours must be a number' })
  @Min(0, { message: 'Actual hours cannot be negative' })
  actualHours: number;

  @IsDateString()
  dueDate: Date;

  @IsUUID(4, { message: 'Assigned to ID must be a valid UUID v4' })
  assignedToId: string;

  @IsUUID(4, { message: 'Project ID must be a valid UUID v4' })
  projectId: string;
}

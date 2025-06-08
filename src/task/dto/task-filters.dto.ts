import {
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class TaskFiltersDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @IsOptional()
  actualHours?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @IsUUID()
  @IsOptional()
  projectId?: string;
}

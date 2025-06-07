import {
  IsDateString,
  IsEnum,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(['planning', 'in_progress', 'completed', 'cancelled'])
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';

  @IsEnum(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsUUID()
  managerId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  developersIds: string[];
}

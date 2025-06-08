import { IsUUID, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  status: string;

  @IsString()
  priority: string;

  @IsNumber()
  estimatedHours: number;

  @IsNumber()
  actualHours: number;

  @IsDateString()
  dueDate: Date;

  @IsUUID()
  assignedToId: string;

  @IsUUID()
  projectId: string;
}

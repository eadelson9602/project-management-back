import { IsUUID } from 'class-validator';

export class AssignTaskDto {
  @IsUUID()
  projectId: string;

  @IsUUID()
  developerId: string;
}

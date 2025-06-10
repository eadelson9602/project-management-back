import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsUUID } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsUUID()
  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'Id del task',
  })
  id: string;
}

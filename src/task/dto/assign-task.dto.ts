import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @IsUUID()
  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'Id del proyecto',
  })
  projectId: string;

  @IsUUID()
  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'Id del desarrollador',
  })
  developerId: string;
}

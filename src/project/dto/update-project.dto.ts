import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'Id del proyecto',
  })
  id: string;
}

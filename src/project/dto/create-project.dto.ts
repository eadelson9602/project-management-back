import {
  IsDateString,
  IsEnum,
  IsString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Proyecto A', description: 'Nombre del proyecto' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descripción del proyecto',
    description: 'Descripción del proyecto',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'planning',
    enum: ['planning', 'in_progress', 'completed', 'cancelled'],
    description: 'Estado del proyecto',
  })
  @IsEnum(['planning', 'in_progress', 'completed', 'cancelled'])
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';

  @ApiProperty({
    example: 'medium',
    enum: ['low', 'medium', 'high'],
    description: 'Prioridad del proyecto',
  })
  @IsEnum(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';

  @ApiProperty({
    example: '2024-06-01',
    description: 'Fecha de inicio (YYYY-MM-DD)',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-12-31',
    description: 'Fecha de fin (YYYY-MM-DD)',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'ID del manager (UUID)',
  })
  @IsUUID()
  managerId: string;

  @ApiProperty({
    type: [String],
    example: [
      'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
      'c8e7d9c3-5678-4f8b-9c2e-987654321def',
    ],
    description: 'Lista de IDs de desarrolladores (UUIDs)',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  developersIds: string[];
}

import {
  IsUUID,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implementar login',
    description: 'Título de la tarea',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'Title must be a string' })
  @Min(1, { message: 'Title must be at least 1 character long' })
  @Max(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @ApiProperty({
    example: 'Crear la funcionalidad de login con JWT',
    description: 'Descripción de la tarea',
    minLength: 1,
    maxLength: 500,
  })
  @IsString({ message: 'Description must be a string' })
  @Min(1, { message: 'Description must be at least 1 character long' })
  @Max(500, { message: 'Description cannot exceed 500 characters' })
  description: string;

  @ApiProperty({
    example: 'todo',
    enum: ['todo', 'in_progress', 'review', 'done'],
    description: 'Estado de la tarea',
  })
  @IsEnum(['todo', 'in_progress', 'review', 'done'], {
    message:
      'Invalid status value. Must be: todo, in_progress, review, or done',
  })
  status: string;

  @ApiProperty({
    example: 'medium',
    enum: ['low', 'medium', 'high'],
    description: 'Prioridad de la tarea',
  })
  @IsEnum(['low', 'medium', 'high'], {
    message: 'Invalid priority value. Must be: low, medium, or high',
  })
  priority: string;

  @ApiProperty({
    example: 8,
    description: 'Horas estimadas para completar la tarea',
    minimum: 0.1,
    maximum: 168,
  })
  @IsNumber({}, { message: 'Estimated hours must be a number' })
  @Min(0.1, { message: 'Estimated hours must be greater than 0' })
  @Max(168, { message: 'Estimated hours cannot exceed 168 hours (1 week)' })
  estimatedHours: number;

  @ApiProperty({
    example: 6,
    description: 'Horas reales invertidas en la tarea',
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Actual hours must be a number' })
  @Min(0, { message: 'Actual hours cannot be negative' })
  actualHours: number;

  @ApiProperty({
    example: '2024-07-01',
    description: 'Fecha límite de la tarea (YYYY-MM-DD)',
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'ID del usuario asignado (UUID v4)',
  })
  @IsUUID(4, { message: 'Assigned to ID must be a valid UUID v4' })
  assignedToId: string;

  @ApiProperty({
    example: 'c8e7d9c3-5678-4f8b-9c2e-987654321def',
    description: 'ID del proyecto al que pertenece la tarea (UUID v4)',
  })
  @IsUUID(4, { message: 'Project ID must be a valid UUID v4' })
  projectId: string;
}

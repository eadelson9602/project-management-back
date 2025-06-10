import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsString,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'Número de página (debe ser mayor que 0)',
    minimum: 1,
    default: 1,
  })
  @IsInt({ message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  @Max(1000, { message: 'Page cannot exceed 1000' })
  page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Cantidad de elementos por página (máximo 100)',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsInt({ message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(100, { message: 'Limit cannot exceed 100 items per page' })
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'login',
    description: 'Término de búsqueda para filtrar resultados',
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;

  @ApiPropertyOptional({
    example: { status: 'completed', priority: 'high' },
    description: 'Filtros avanzados como objeto',
    type: Object,
  })
  @IsOptional()
  @ValidateNested()
  filters?: any;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Campo por el cual ordenar los resultados',
    enum: ['title', 'status', 'priority', 'createdAt', 'updatedAt'],
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a valid column name' })
  @IsIn(['title', 'status', 'priority', 'createdAt', 'updatedAt'], {
    message:
      'Invalid sort field. Must be: title, status, priority, createdAt, or updatedAt',
  })
  sortField?: string;

  @ApiPropertyOptional({
    example: SortOrder.ASC,
    description:
      'Orden de la lista: ASC para ascendente, DESC para descendente',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Sort order must be either ASC or DESC' })
  sortOrder?: SortOrder = SortOrder.ASC;
}

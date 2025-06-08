import { IsInt, IsOptional, Min, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  filters?: Record<string, any>;

  @IsOptional()
  sortField?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;
}

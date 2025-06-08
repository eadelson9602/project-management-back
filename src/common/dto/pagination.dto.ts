import { IsInt, IsOptional, Min, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  limit: number = 10;

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

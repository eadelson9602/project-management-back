import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  search?: string;

  @IsOptional()
  filters?: Record<string, any>;

  @IsOptional()
  sortField?: string;

  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

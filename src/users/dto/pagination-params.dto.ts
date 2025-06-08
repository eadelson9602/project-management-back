export class PaginationParamsDto {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsNull } from 'typeorm';

@Injectable()
export class AdvancedSearchService {
  // Método genérico para búsqueda avanzada
  async search<T extends ObjectLiteral>(
    repository: Repository<T>,
    pagination: PaginationDto,
    filters: any,
    searchFields: string[] = [],
    softDelete = true,
  ): Promise<{
    data: T[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    try {
      // Validar parámetros
      if (!repository) {
        throw new BadRequestException('Repository is required');
      }

      const queryBuilder = repository.createQueryBuilder('entity');

      // Filtrar por registros no eliminados si softDelete está habilitado
      if (softDelete) {
        queryBuilder.where({ deletedAt: IsNull() });
      }

      // Validar campos de búsqueda
      if (pagination.search && searchFields.length === 0) {
        throw new BadRequestException(
          'Search fields are required when using search',
        );
      }

      // Búsqueda por texto en campos específicos
      if (pagination.search && searchFields.length > 0) {
        const searchConditions = searchFields.map(
          (field) => `entity.${field} ILIKE :search`,
        );
        queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
          search: `%${pagination.search}%`,
        });
      }

      // Validar y aplicar filtros específicos
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            // Validar que el campo existe en la entidad
            if (
              !repository.metadata.columns.find(
                (col) => col.propertyName === key,
              )
            ) {
              throw new BadRequestException(`Invalid filter field: ${key}`);
            }

            // Si el valor es un string, lo tratamos como un filtro exacto para campos enum
            if (typeof value === 'string') {
              const column = repository.metadata.columns.find(
                (col) => col.propertyName === key,
              );

              // Si es un campo enum, usamos = en lugar de ILIKE
              if (column?.type === 'enum') {
                queryBuilder.andWhere(`entity.${key} = :${key}`, {
                  [key]: value,
                });
              } else {
                queryBuilder.andWhere(`entity.${key} ILIKE :${key}`, {
                  [key]: `%${value}%`,
                });
              }
            }
            // Si el valor es un array, lo tratamos como IN
            else if (Array.isArray(value)) {
              if (value.length === 0) {
                throw new BadRequestException(
                  `Filter array cannot be empty for field: ${key}`,
                );
              }
              queryBuilder.andWhere(`entity.${key} IN (:...${key})`, {
                [key]: value,
              });
            }
            // Si el valor es un objeto, lo tratamos como un filtro compuesto
            else if (typeof value === 'object' && value !== null) {
              queryBuilder.andWhere(`entity.${key} = :${key}`, {
                [key]: value,
              });
            }
          }
        });
      }

      // Validar campo de ordenamiento
      if (pagination.sortField) {
        const column = repository.metadata.columns.find(
          (col) => col.propertyName === pagination.sortField,
        );
        if (!column) {
          throw new BadRequestException(
            `Invalid sort field: ${pagination.sortField}`,
          );
        }
        queryBuilder.orderBy(
          `entity.${pagination.sortField}`,
          pagination.sortOrder,
        );
      }

      // Paginación
      const [items, total] = await queryBuilder
        .skip((pagination.page ?? 1) - 1) // Default to 1 if undefined
        .take(pagination.limit ?? 10) // Default to 10 if undefined
        .getManyAndCount();

      return {
        data: items,
        meta: {
          page: pagination.page ?? 1,
          limit: pagination.limit ?? 10,
          totalItems: total,
          totalPages: Math.ceil(total / (pagination.limit ?? 10)),
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error performing advanced search');
    }
  }
}

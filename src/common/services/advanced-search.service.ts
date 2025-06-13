/* eslint-disable @typescript-eslint/no-base-to-string */
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
            const column = repository.metadata.columns.find(
              (col) => col.propertyName === key,
            );

            if (!column) {
              throw new BadRequestException(`Invalid filter field: ${key}`);
            }

            // Manejar diferentes tipos de datos según el tipo de columna
            switch (column.type) {
              case 'enum':
                // Para campos enum, usar comparación exacta
                if (typeof value === 'string') {
                  queryBuilder.andWhere(`entity.${key} = :${key}`, {
                    [key]: value,
                  });
                } else {
                  throw new BadRequestException(
                    `Invalid value type for enum field: ${key}, expected string but got ${typeof value}`,
                  );
                }
                break;

              case 'uuid':
                // Para UUID, validar que sea un string
                if (typeof value === 'string') {
                  queryBuilder.andWhere(`entity.${key} = :${key}`, {
                    [key]: value,
                  });
                } else {
                  throw new BadRequestException(
                    `Invalid value type for UUID field: ${key}, expected string but got ${typeof value}`,
                  );
                }
                break;

              case 'number':
              case 'int':
              case 'integer':
              case 'float':
              case 'decimal':
              case 'bigint':
                // Para campos numéricos, validar que sea un string y convertir
                if (typeof value === 'string') {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    queryBuilder.andWhere(`entity.${key} = :${key}`, {
                      [key]: numValue,
                    });
                  } else {
                    throw new BadRequestException(
                      `Invalid number format for field: ${key}`,
                    );
                  }
                } else {
                  throw new BadRequestException(
                    `Invalid value type for number field: ${key}, expected string but got ${typeof value}`,
                  );
                }
                break;

              case 'date':
              case 'datetime':
              case 'timestamp':
                // Para campos de fecha, usar comparación exacta de string
                if (typeof value === 'string') {
                  queryBuilder.andWhere(`entity.${key} = :${key}`, {
                    [key]: value,
                  });
                } else {
                  throw new BadRequestException(
                    `Invalid value type for date field: ${key}, expected string but got ${typeof value}`,
                  );
                }
                break;

              default:
                // Para otros tipos (text, varchar, etc.) usar ILIKE
                queryBuilder.andWhere(`entity.${key} ILIKE :${key}`, {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  [key]: `%${value}%`,
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

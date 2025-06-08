import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsNull } from 'typeorm';
import { SortOrder } from '@/common/dto/pagination.dto';

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
      const queryBuilder = repository.createQueryBuilder('entity');

      // Filtrar por registros no eliminados si softDelete está habilitado
      if (softDelete) {
        queryBuilder.where({ deletedAt: IsNull() });
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

      // Aplicar filtros específicos
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            // Si el valor es un string, lo tratamos como un filtro de igualdad
            if (typeof value === 'string') {
              queryBuilder.andWhere(`entity.${key} = :${key}`, {
                [key]: value,
              });
            }
            // Si es un objeto JSON, intentamos extraer el valor del campo específico
            else if (typeof value === 'object' && value !== null) {
              // Si es un objeto JSON, intentamos extraer el valor del campo específico
              if (key === 'role') {
                queryBuilder.andWhere(`entity.${key} = :${key}`, {
                  [key]: value,
                });
              } else {
                // Para otros campos que sean objetos, usamos JSON.stringify
                queryBuilder.andWhere(`entity.${key} = :${key}`, {
                  [key]: JSON.stringify(value),
                });
              }
            }
          }
        });
      }

      // Ordenamiento
      if (pagination.sortField && pagination.sortOrder) {
        const validFields = searchFields;
        if (!validFields.includes(pagination.sortField)) {
          throw new Error(
            `Invalid sort field: ${pagination.sortField}.\n` +
              `Please use one of the following fields: ${validFields.join(', ')}`,
          );
        }
        queryBuilder.orderBy(
          `entity.${pagination.sortField}`,
          pagination.sortOrder === SortOrder.ASC ? 'ASC' : 'DESC',
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

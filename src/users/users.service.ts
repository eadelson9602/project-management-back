import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from './helpers/bcrypt.helper';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordEncrypt: string = hashPassword(createUserDto.password);

      const user: Partial<User> = this.userRepository.create({
        ...createUserDto,
        password: passwordEncrypt,
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll(
    filters: Partial<UserFiltersDto>,
    pagination: PaginationQueryDto,
  ) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      queryBuilder.where({ deletedAt: IsNull() });

      // Filtros
      if (pagination.search) {
        queryBuilder.andWhere('user.email ILIKE :search', {
          search: `%${pagination.search}%`,
        });
      }

      if (filters) {
        const data = filters as unknown;
        const optionsFilters = JSON.parse(data as string) as UserFiltersDto;

        if (optionsFilters.email) {
          queryBuilder.andWhere('user.email = :email', {
            email: optionsFilters.email,
          });
        }
        if (optionsFilters.name) {
          queryBuilder.andWhere('user.name = :name', {
            name: optionsFilters.name,
          });
        }
        if (optionsFilters.role) {
          queryBuilder.andWhere('user.role = :role', {
            role: optionsFilters.role,
          });
        }
        if (optionsFilters.isActive !== undefined) {
          queryBuilder.andWhere('user.isActive = :isActive', {
            isActive: optionsFilters.isActive,
          });
        }
        if (optionsFilters.createdAt) {
          queryBuilder.andWhere('user.createdAt = :createdAt', {
            createdAt: optionsFilters.createdAt,
          });
        }
        if (optionsFilters.updatedAt) {
          queryBuilder.andWhere('user.updatedAt = :updatedAt', {
            updatedAt: optionsFilters.updatedAt,
          });
        }
        if (optionsFilters.deletedAt) {
          queryBuilder.andWhere('user.deletedAt = :deletedAt', {
            deletedAt: optionsFilters.deletedAt,
          });
        }
      }

      // Ordenamiento
      if (pagination.sortField && pagination.sortOrder) {
        const validFields = ['id', 'email', 'name', 'createdAt', 'updatedAt'];
        if (!validFields.includes(pagination.sortField)) {
          throw new BadRequestException(
            `Invalid sort field: ${pagination.sortField}.
            Please use one of the following fields: ${validFields.join(', ')}`,
          );
        }
        queryBuilder.orderBy(
          `user.${pagination.sortField}`,
          pagination.sortOrder,
        );
      }

      // Paginación
      const [items, total] = await queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit)
        .getManyAndCount();

      return {
        data: items,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          totalItems: total,
          totalPages: Math.ceil(total / pagination.limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findDeleted(pagination: PaginationQueryDto) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      queryBuilder.where({ deletedAt: Not(IsNull()) });

      // Filtros
      if (pagination.search) {
        queryBuilder.andWhere('user.email ILIKE :search', {
          search: `%${pagination.search}%`,
        });
      }

      if (pagination.filters) {
        // Define valid filter fields based on User entity
        type UserFilter = {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'manager' | 'developer';
          avatar?: string;
        };

        Object.entries(pagination.filters as UserFilter).forEach(
          ([key, value]) => {
            if (value !== undefined) {
              queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: value });
            }
          },
        );
      }

      // Ordenamiento
      if (pagination.sortField && pagination.sortOrder) {
        queryBuilder.orderBy(
          `user.${pagination.sortField}`,
          pagination.sortOrder,
        );
      }

      // Paginación
      const [items, total] = await queryBuilder
        .skip((pagination.page - 1) * pagination.limit)
        .take(pagination.limit)
        .getManyAndCount();

      return {
        data: items,
        meta: {
          page: pagination.page,
          limit: pagination.limit,
          totalItems: total,
          totalPages: Math.ceil(total / pagination.limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching deleted users');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          deletedAt: IsNull(),
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          deletedAt: IsNull(),
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      const updatedUser = {
        ...user,
        ...updateUserDto,
      };

      if (updateUserDto.password) {
        updatedUser.password = hashPassword(updateUserDto.password);
      }

      return this.userRepository.save(updatedUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async delete(id: string, softDelete: boolean = false) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          deletedAt: IsNull(),
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      if (softDelete) {
        return this.userRepository.update(id, {
          deletedAt: new Date(),
        });
      }

      return this.userRepository.delete(id);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async restore(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          deletedAt: Not(IsNull()),
        },
      });

      if (!user) {
        throw new NotFoundException(`Deleted user with id ${id} not found`);
      }

      return this.userRepository.update(id, {
        deletedAt: undefined,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error restoring user');
    }
  }
}

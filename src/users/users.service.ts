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
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { hashPassword } from './helpers/bcrypt.helper';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Not, IsNull } from 'typeorm';
import { AdvancedSearchService } from '@/common/services/advanced-search.service';
import { handleDBExceptions } from '@/helpers/handleDBExceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly advancedSearchService: AdvancedSearchService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const passwordEncrypt: string = hashPassword(createUserDto.password);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: passwordEncrypt,
      });

      const savedUser = await queryRunner.manager.save(newUser);

      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error: unknown) {
      // Devuelve los cambios realizados en la base de datos
      await queryRunner.rollbackTransaction();

      // Manejo específico de errores de base de datos
      if (error instanceof QueryFailedError) {
        handleDBExceptions(error as QueryFailedError);
      }

      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      return await this.advancedSearchService.search(
        this.userRepository,
        pagination,
        pagination.filters,
        ['email', 'name', 'role'],
        true,
      );
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestException('Error fetching users');
    }
  }

  async findDeleted(pagination: PaginationDto) {
    try {
      const searchFields = ['id', 'email', 'name', 'createdAt', 'updatedAt'];
      return await this.advancedSearchService.search(
        this.userRepository,
        pagination,
        pagination.filters,
        searchFields,
        false, // softDelete = false para obtener registros eliminados
      );
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

  async update(updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: updateUserDto.id,
          deletedAt: IsNull(),
        },
      });
      if (!user) {
        throw new NotFoundException(
          `User with id ${updateUserDto.id} not found`,
        );
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

  async remove(id: string, softDelete: boolean = false) {
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
        user.deletedAt = new Date();
        return this.userRepository.save(user);
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

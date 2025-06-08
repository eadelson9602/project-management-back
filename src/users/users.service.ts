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
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { Not, IsNull } from 'typeorm';
import { AdvancedSearchService } from '@/common/services/advanced-search.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly advancedSearchService: AdvancedSearchService,
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

  async findAll(pagination: PaginationDto, filters: UserFiltersDto) {
    try {
      return await this.advancedSearchService.search(
        this.userRepository,
        pagination,
        filters,
        ['email', 'name', 'role'],
        true,
      );
    } catch (error) {
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
        {},
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

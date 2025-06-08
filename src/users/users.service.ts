import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from './helpers/bcrypt.helper';

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
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: updateUserDto.id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (updateUserDto.password) {
        updateUserDto.password = hashPassword(updateUserDto.password);
      }
      await this.userRepository.update(updateUserDto.id, updateUserDto);
      return await this.userRepository.findOne({
        where: { id: updateUserDto.id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.delete(id);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}

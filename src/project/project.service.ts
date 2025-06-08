import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // Constructor body
  }

  async create(createProjectDto: CreateProjectDto) {
    try {
      const manager = await this.userRepository.findOneBy({
        id: createProjectDto.managerId,
      });

      if (!manager) throw new NotFoundException('Manager not found');

      const developers = await this.userRepository.findBy({
        id: In(createProjectDto.developersIds),
      });

      if (developers.length !== createProjectDto.developersIds.length) {
        throw new BadRequestException('One or more developer IDs are invalid');
      }

      const project = this.projectRepository.create({
        ...createProjectDto,
        manager,
        developers,
      });

      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.projectRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.projectRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateProjectDto: UpdateProjectDto) {
    try {
      const user = await this.projectRepository.findOne({
        where: { id: updateProjectDto.id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.projectRepository.update(
        updateProjectDto.id,
        updateProjectDto,
      );
      return await this.projectRepository.findOne({
        where: { id: updateProjectDto.id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.projectRepository.delete(id);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}

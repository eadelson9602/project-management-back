import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      const manager = await this.userRepository.findOneBy({
        id: createProjectDto.managerId,
      });
      const project = this.projectRepository.create({
        ...createProjectDto,
        manager: manager || undefined,
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

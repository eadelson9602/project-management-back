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
import { AdvancedSearchService } from '@/common/services/advanced-search.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly advancedSearchService: AdvancedSearchService,

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

  async findAll(pagination: PaginationDto, filters: any) {
    try {
      return this.advancedSearchService.search(
        this.projectRepository,
        pagination,
        filters,
        ['name', 'description'],
        false,
      );
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
      const project = await this.projectRepository.findOne({ where: { id } });
      if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      await this.projectRepository.softDelete(id);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async restore(id: string) {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });
      if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }
      await this.projectRepository.restore(id);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}

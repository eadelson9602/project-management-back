import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private async applyTaskUpdates(
    task: Task,
    dto: Partial<UpdateTaskDto | AssignTaskDto>,
  ): Promise<Task> {
    if ('developerId' in dto && dto.developerId) {
      const user = await this.userRepo.findOneBy({ id: dto.developerId });
      if (!user) throw new NotFoundException('Assigned user not found');

      const project = await this.projectRepo.findOne({
        where: { id: task.projectId },
        relations: ['developers'],
      });

      const isValid = project?.developers.some((dev) => dev.id === user.id);
      if (!isValid) {
        throw new BadRequestException(
          'Assigned user is not a developer on the project',
        );
      }

      task.assignedTo = user;
    }

    if (
      'projectId' in dto &&
      dto.projectId &&
      dto.projectId !== task.projectId
    ) {
      const project = await this.projectRepo.findOne({
        where: { id: dto.projectId },
        relations: ['developers'],
      });
      if (!project) throw new NotFoundException('Project not found');

      task.project = project;
      task.projectId = project.id;
    }

    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    try {
      const project = await this.projectRepo.findOne({
        where: { id: dto.projectId },
        relations: ['developers'],
      });
      if (!project) throw new NotFoundException('Project not found');

      const developer = await this.userRepo.findOneBy({ id: dto.assignedToId });
      if (!developer) throw new NotFoundException('Assigned user not found');

      const isDevInProject = project.developers.some(
        (dev) => dev.id === developer.id,
      );
      if (!isDevInProject) {
        throw new BadRequestException(
          'Assigned user is not a developer on the project',
        );
      }

      const task = this.taskRepo.create({
        ...dto,
        project,
        assignedTo: developer,
      });

      return this.taskRepo.save(task);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error creating task');
    }
  }

  async assignTask(taskId: string, dto: AssignTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({
        where: { id: taskId },
        relations: ['project', 'assignedTo'],
      });

      if (!task) throw new NotFoundException('Task not found');

      return this.applyTaskUpdates(task, {
        assignedToId: dto.developerId,
        projectId: dto.projectId,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error assigning task');
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskRepo.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching tasks');
    }
  }

  async findOne(id: string): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) throw new NotFoundException('Task not found');
      return task;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching task');
    }
  }

  async update(dto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({
        where: { id: dto.id },
        relations: ['project', 'assignedTo'],
      });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return this.applyTaskUpdates(task, dto);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error updating task: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Error updating task');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.taskRepo.delete(id);
      if (result.affected === 0) throw new NotFoundException('Task not found');
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting task');
    }
  }
}

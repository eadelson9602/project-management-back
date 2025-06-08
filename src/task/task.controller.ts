import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, TaskFiltersDto } from './dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ValidRoles } from '@/auth/interfaces/valid-roles.interface';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Query } from '@nestjs/common';

@Controller('task')
@Auth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    // Convertir el objeto de filtros a un objeto JavaScript si es necesario
    let filters: TaskFiltersDto = {};
    if (pagination.filters && typeof pagination.filters === 'string') {
      const tempFilter = pagination.filters as unknown as string;
      filters = JSON.parse(tempFilter) as TaskFiltersDto;
    }
    return this.taskService.findAll(pagination, filters);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch('update')
  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER)
  update(@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(updateTaskDto);
  }

  @Delete('remove/:id')
  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER)
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}

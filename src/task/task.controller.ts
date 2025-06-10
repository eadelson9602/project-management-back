import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskService } from './task.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Crear tarea' })
  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'Tarea creada exitosamente',
    type: CreateTaskDto,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos para crear la tarea' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Post()
  @ApiOperation({ summary: 'Listar tareas con filtros avanzados' })
  @ApiOkResponse({
    description: 'Lista de tareas paginada',
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            title: 'Implementar login',
            description: 'Crear la funcionalidad de login con JWT',
            status: 'todo',
            priority: 'medium',
            estimatedHours: 8,
            actualHours: 6,
            dueDate: '2024-07-01',
            assignedToId: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
            projectId: 'c8e7d9c3-5678-4f8b-9c2e-987654321def',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          totalItems: 100,
          totalPages: 10,
        },
      },
    },
  })
  findAll(@Body() pagination: PaginationDto) {
    return this.taskService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tarea por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiOkResponse({
    description: 'Tarea encontrada exitosamente',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tarea' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'Tarea actualizada exitosamente',
    type: Task,
  })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  @ApiBadRequestResponse({
    description: 'Datos inválidos para actualizar la tarea',
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tarea' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @ApiNoContentResponse({ description: 'Tarea eliminada exitosamente' })
  @ApiNotFoundResponse({ description: 'Tarea no encontrada' })
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}

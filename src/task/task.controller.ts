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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ValidRoles } from '@/auth/interfaces/valid-roles.interface';

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
  findAll() {
    return this.taskService.findAll();
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

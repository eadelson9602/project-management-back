import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch('/update')
  update(@Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(updateProjectDto);
  }

  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

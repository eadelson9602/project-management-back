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
} from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { ProjectService } from './project.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear proyecto' })
  @ApiBody({ type: CreateProjectDto })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Post()
  @ApiOperation({ summary: 'Listar proyectos con filtros avanzados' })
  findAll(@Body() pagination: PaginationDto) {
    return this.projectService.findAll(pagination);
  }

  @Get('find/:id')
  @ApiOperation({ summary: 'Obtener proyecto por ID' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Actualizar proyecto' })
  @ApiBody({ type: UpdateProjectDto })
  update(@Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(updateProjectDto);
  }

  @Delete('remove/:id')
  @ApiOperation({ summary: 'Eliminar proyecto' })
  @ApiParam({ name: 'id', description: 'ID del proyecto' })
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

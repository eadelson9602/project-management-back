import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, ProjectFiltersDto, UpdateProjectDto } from './dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ValidRoles } from '@/auth/interfaces/valid-roles.interface';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('projects')
@Auth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    // Convertir el objeto de filtros a un objeto JavaScript si es necesario
    let filters: ProjectFiltersDto = {};
    if (pagination.filters && typeof pagination.filters === 'string') {
      const tempFilter = pagination.filters as unknown as string;
      filters = JSON.parse(tempFilter) as ProjectFiltersDto;
    }
    return this.projectService.findAll(pagination, filters);
  }

  @Get('/find/:id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch('/update')
  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER)
  update(@Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(updateProjectDto);
  }

  @Delete('/remove/:id')
  @Auth(ValidRoles.ADMIN, ValidRoles.MANAGER)
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}

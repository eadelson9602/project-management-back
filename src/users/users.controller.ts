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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ValidRoles } from '@/auth/interfaces/valid-roles.interface';
import { SoftDelete } from '@/common/decorators/soft-delete.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { UserFiltersDto } from './dto/user-filters.dto';

@Controller('users')
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.ADMIN)
  findAll(@Query() pagination: PaginationDto) {
    // Convertir el objeto de filtros a un objeto JavaScript si es necesario
    let filters: UserFiltersDto = {};
    if (pagination.filters && typeof pagination.filters === 'string') {
      const tempFilter = pagination.filters as unknown as string;
      filters = JSON.parse(tempFilter) as UserFiltersDto;
    }
    return this.usersService.findAll(pagination, filters);
  }

  @Get('deleted')
  @Auth(ValidRoles.ADMIN)
  findDeleted(@Query() pagination: PaginationDto) {
    return this.usersService.findDeleted(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.ADMIN)
  delete(@Param('id') id: string, @SoftDelete() softDelete: boolean = false) {
    return this.usersService.delete(id, softDelete);
  }

  @Post('restore/:id')
  @Auth(ValidRoles.ADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
}

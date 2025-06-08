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
import { PaginationQueryDto } from './dto/pagination-query.dto';

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
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.usersService.findAll(pagination.filters || {}, pagination);
  }

  @Get('deleted')
  @Auth(ValidRoles.ADMIN)
  findDeleted(@Query() pagination: PaginationQueryDto) {
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

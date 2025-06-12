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
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post()
  @ApiOperation({ summary: 'Listar usuarios con filtros avanzados' })
  findAll(@Body() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @Get('/find/:id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('/update/')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

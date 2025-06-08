import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ValidRoles } from '@/auth/interfaces/valid-roles.interface';

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
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/find/:id')
  @Auth(ValidRoles.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete('/remove/:id')
  @Auth(ValidRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

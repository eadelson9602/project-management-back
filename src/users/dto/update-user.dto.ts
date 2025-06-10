import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: 'b7e6d8c2-1234-4f8b-9c2e-123456789abc',
    description: 'Id del usuario  (Usuario)',
  })
  id: string;
}

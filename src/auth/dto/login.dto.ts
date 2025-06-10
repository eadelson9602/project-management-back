import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email del usuario',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: '12345678',
    description: 'Contraseña del usuario',
  })
  password: string;
}

import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'juan.perez@email.com',
    description: 'Correo electrónico del usuario',
    minLength: 6,
    maxLength: 50,
  })
  @IsEmail()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @ApiProperty({
    example: 'Password123',
    description:
      'Contraseña del usuario. Debe tener mayúsculas, minúsculas y un número.',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: 'developer',
    enum: ['admin', 'manager', 'developer'],
    description: 'Rol del usuario',
  })
  @IsEnum(['admin', 'manager', 'developer'])
  role: 'admin' | 'manager' | 'developer';

  @ApiPropertyOptional({
    example: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: 'URL del avatar del usuario',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    example: '2024-06-10T12:00:00.000Z',
    description: 'Fecha de creación del usuario',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

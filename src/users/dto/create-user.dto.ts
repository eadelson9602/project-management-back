import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MinLength(6)
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @IsEnum(['admin', 'manager', 'developer'])
  role: 'admin' | 'manager' | 'developer';

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

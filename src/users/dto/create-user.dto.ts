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
  @MaxLength(100)
  @IsString()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
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

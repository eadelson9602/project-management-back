import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { comparePassword } from '../users/helpers/bcrypt.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(user: User): string {
    return this.jwtService.sign({ id: user.id });
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        select: { password: true, email: true, id: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordMatch = comparePassword(loginDto.password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.getJwtToken(user);
      return { id: user.id, email: user.email, token };
    } catch (error) {
      console.error(error);

      if (error instanceof Error && error.message == 'Invalid credentials') {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  logout(uuid: string) {
    console.log(uuid);
    return 'This action adds a new auth';
  }

  refreshToken(user: User) {
    const token = this.getJwtToken(user);
    return { id: user.id, email: user.email, token };
  }
}

import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    console.log(loginDto);
    return 'This action adds a new auth';
  }

  logout(uuid: string) {
    console.log(uuid);
    return 'This action adds a new auth';
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export type UserContext = {
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findUserByUsernameAndPassword(
      username,
      password
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: UserContext = { sub: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username: string, password: string) {
    return this.usersService.createUser(username, password);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByUsernameAndPassword(username: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username, hashedPassword: this.hashPassword(password) },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(username: string, password: string) {
    return await this.prismaService.user.create({
      data: {
        username,
        hashedPassword: this.hashPassword(password),
      },
    });
  }

  private hashPassword(password: string) {
    // Implement password hashing here
    return password;
  }
}

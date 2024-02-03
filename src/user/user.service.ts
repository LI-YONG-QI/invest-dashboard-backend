import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(address: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        address,
      },
      include: { assets: true },
    });

    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: { assets: true },
    });

    return users;
  }

  createUser() {
    return 'Create User';
  }
}

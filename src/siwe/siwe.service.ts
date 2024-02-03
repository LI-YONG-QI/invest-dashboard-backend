import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SiweService {
  constructor(private readonly prisma: PrismaService) {}

  async processUser(address: string) {
    let user = await this.prisma.user.findUnique({
      where: {
        address,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          address,
        },
      });
    }
  }

  async deleteUser() {
    await this.prisma.user.deleteMany();
  }
}

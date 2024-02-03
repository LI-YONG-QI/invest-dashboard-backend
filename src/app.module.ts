import { Module } from '@nestjs/common';
import { AssetsModule } from './assets/assets.module';
import { CurrencyModule } from './currency/currency.module';
import { PrismaModule } from './prisma/prisma.module';
import { SiweModule } from './siwe/siwe.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AssetsModule, CurrencyModule, PrismaModule, SiweModule, UserModule],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrencyDTO } from './currency.controller';

@Injectable()
export class CurrencyService {
  COIN_MARKET_API_KEY = 'f3a2cbe1-f9aa-4b83-899f-22b3bd52b224'; //TODO
  COIN_MARKET_API_DOMAIN = 'https://pro-api.coinmarketcap.com'; //TODO

  constructor(private prisma: PrismaService) {}

  async getAllCurrency() {
    return await this.prisma.currency.findMany({
      include: { assets: true },
    });
  }

  async getCurrencyList(id: string) {
    return id.split(',').map((id) => Number(id));
  }

  async getCurrency(id: string) {
    const idList = await this.getCurrencyList(id);
    return await this.prisma.currency.findMany({
      where: {
        id: {
          in: idList,
        },
      },
    });
  }

  async getCurrencyInfo(aid: string) {
    const currencyMap = await axios.get(
      `${this.COIN_MARKET_API_DOMAIN}/v2/cryptocurrency/info`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': this.COIN_MARKET_API_KEY,
          Accept: 'application/json',
        },
        params: {
          id: aid,
        },
      },
    );

    const { id, name, symbol, logo } = currencyMap.data.data[aid];
    return { id, name, symbol, logo };
  }

  async createCurrency(dto: CurrencyDTO) {
    const currency = await this.prisma.currency.create({
      data: {
        ...dto,
      },
    });
    return { message: 'Asset created', currency };
  }

  async deleteAllCurrency() {
    await this.prisma.currency.deleteMany();
    return { message: 'Asset deleted' };
  }
}

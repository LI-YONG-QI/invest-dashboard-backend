import { Injectable } from '@nestjs/common';
import { Asset as AssetModel } from '@prisma/client';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { Asset, AssetDTO } from './assets.class';

@Injectable()
export class AssetsService {
  COIN_MARKET_API_KEY = 'f3a2cbe1-f9aa-4b83-899f-22b3bd52b224'; //TODO
  COIN_MARKET_API_DOMAIN = 'https://pro-api.coinmarketcap.com'; //TODO

  constructor(private prisma: PrismaService) {}

  async getCurrencyQuotes(ids: string) {
    const coinmarketcapRes = await axios.get(
      `${this.COIN_MARKET_API_DOMAIN}/v1/cryptocurrency/quotes/latest`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': this.COIN_MARKET_API_KEY,
          Accept: 'application/json',
        },

        params: {
          id: ids,
        },
      },
    );

    return coinmarketcapRes.data.data;
  }

  async getAssetsViewList(assets: AssetModel[]) {
    if (assets.length === 0) {
      return [];
    }
    const res = [];
    const assetsIDs = assets.map((item) => item.currencyId.toString());

    const currencyQuotes = await this.getCurrencyQuotes(assetsIDs.join(','));

    assets.forEach((item: AssetModel) => {
      const assetCurrentPrice = currencyQuotes[item.currencyId].quote.USD.price;
      const asset = new Asset(item, assetCurrentPrice);

      res.push({
        ...item,
        price: asset.currentPrice,
        currentValue: asset.getCurrentValue(),
        profit: asset.getProfitPercentage(),
      });
    });

    return res;
  }

  //CONTROLLER FUNCTIONS

  async getAssets(userId: string) {
    let assets: AssetModel[];

    if (userId) {
      assets = await this.prisma.asset.findMany({
        where: {
          userId,
        },
        include: { currency: true },
      });
    } else {
      assets = await this.prisma.asset.findMany({
        include: { currency: true },
      });
    }

    const res = await this.getAssetsViewList(assets);
    return res;
  }

  async createAsset(dto: AssetDTO) {
    const { quantity, value, currencyId, creator } = dto;
    console.log(dto);

    const asset = await this.prisma.asset.create({
      data: {
        quantity,
        value,
        currency: {
          connect: {
            id: currencyId,
          },
        },
        user: {
          connect: {
            address: creator,
          },
        },
      },
    });
    return { message: 'Asset created', asset };
  }

  async deleteAllAssets() {
    await this.prisma.asset.deleteMany();

    return { message: 'Deleted!' };
  }
}

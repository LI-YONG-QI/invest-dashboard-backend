import { Asset as AssetModel } from '@prisma/client';

export class AssetDTO {
  currencyId: number;
  quantity: number;
  value: number;
  creator: string;
}

export class Asset {
  constructor(
    public portfolio: AssetModel,
    public currentPrice: number,
  ) {}

  getProfitPercentage() {
    const { value, quantity } = this.portfolio;

    const profitRatio = value / quantity / this.currentPrice;
    return Number((1 - profitRatio) * 100);
  }

  getCurrentValue() {
    const { quantity } = this.portfolio;

    return quantity * this.currentPrice;
  }
}

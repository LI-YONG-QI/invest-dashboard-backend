import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrencyService } from './currency.service';

export interface CurrencyDTO {
  // TODO move interface
  id: number;
  name: string;
  symbol: string;
  logo: string;
}

@Controller('currency')
export class CurrencyController {
  constructor(private readonly appService: CurrencyService) {}

  @Get()
  getAllCurrency() {
    return this.appService.getAllCurrency();
  }

  @Get(':id')
  getCurrency(@Param('id') id: string) {
    return this.appService.getCurrency(id);
  }

  @Get('/info/:id')
  getCurrencyInfo(@Param('id') id: string) {
    return this.appService.getCurrencyInfo(id);
  }

  @Post()
  createCurrency(@Body() dto: CurrencyDTO) {
    return this.appService.createCurrency(dto);
  }

  @Delete()
  deleteAllCurrency() {
    return this.appService.deleteAllCurrency();
  }
}

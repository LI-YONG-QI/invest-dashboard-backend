import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetDTO } from './assets.class';

@Controller('assets')
export class AssetsController {
  constructor(private readonly appService: AssetsService) {}

  @Get()
  getAssets(@Query('userId') userId: string) {
    return this.appService.getAssets(userId);
  }

  @Post()
  @HttpCode(200)
  createAsset(@Body() dto: AssetDTO) {
    return this.appService.createAsset(dto);
  }

  @Delete()
  deleteAllAssets() {
    return this.appService.deleteAllAssets();
  }
}

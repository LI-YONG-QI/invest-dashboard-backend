import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  getUser(@Query('address') address: string) {
    if (!address) {
      return this.appService.getAllUsers();
    }
    return this.appService.getUser(address);
  }

  @Post()
  createUser() {
    return this.appService.createUser();
  }
}

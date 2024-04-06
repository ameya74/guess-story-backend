import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ConnectWalletDto, SingleUserDto } from './dto/create-user.dto';
import { TRequestWithAuth } from 'src/_common/types.global';
import { AuthGuard } from 'src/_common/middleware/auth.guard';

@Controller({ path: 'user', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('connect/wallet')
  @HttpCode(201)
  generateWalletToken(@Body() connectWalletDto: ConnectWalletDto) {
    return this.usersService.handleWalletConnect(connectWalletDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Req() req: TRequestWithAuth) {
    return this.usersService.getUserProfile(req.walletAddress.toLowerCase());
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUser(@Param() { id }: SingleUserDto) {
    return this.usersService.getUser(id);
  }
}

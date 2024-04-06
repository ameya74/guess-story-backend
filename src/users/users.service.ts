import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserQueryService from 'src/_common/database/queries/user.query';
import { UserDoc } from 'src/_common/database/schema/user.schema';
import { Role } from 'src/_common/types.global';
import { ConnectWalletDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  userQueryService: UserQueryService;
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') UserModel: Model<UserDoc>,
  ) {
    this.userQueryService = new UserQueryService(UserModel);
  }

  generateJWT(obj: object, type: 'access' | 'refresh'): string {
    if (type === 'access')
      return this.jwtService.sign(obj, { expiresIn: '1h' });
    return this.jwtService.sign(obj, { expiresIn: '7d' });
  }

  async handleWalletConnect(
    user: ConnectWalletDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const walletAddress = user.walletAddress.toLowerCase();
    const jwt = this.generateJWT({ walletAddress }, 'access');
    if (await this.userQueryService.checkValidity({ walletAddress })) {
      const _user = await this.userQueryService.readEntity({
        walletAddress,
      });
      if (_user.role.includes(Role.User))
        return { accessToken: jwt, refreshToken: null };
      if (_user.role.includes(Role.Admin))
        return {
          accessToken: jwt,
          refreshToken: this.generateJWT({ walletAddress }, 'refresh'),
        };
      throw new BadRequestException('error in handleWalletConnect');
    }
    await this.userQueryService.createEntity({
      ...user,
      walletAddress,
    });
    return { accessToken: jwt, refreshToken: null };
  }

  async getUserProfile(walletAddress: string): Promise<UserDoc> {
    return this.userQueryService.readEntity({ walletAddress });
  }

  async getUser(_id: string): Promise<UserDoc> {
    return this.userQueryService.readEntity({ _id });
  }
}

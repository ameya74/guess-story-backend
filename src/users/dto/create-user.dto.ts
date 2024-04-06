import { Equals, IsString, Validate } from 'class-validator';
import { IsObjectId } from 'src/_common/decorators/ObjectId.decorator';
import { IsWalletAddress } from 'src/_common/decorators/walletAddress.decorator';
import { Role } from 'src/_common/types.global';

export class CreateUserDto {}

export class ConnectWalletDto {
  @IsString()
  @Equals(Role.User)
  role: Role;

  @IsString()
  @Validate(IsWalletAddress)
  walletAddress: string;
}

export class SingleUserDto {
  @Validate(IsObjectId)
  id: string;
}

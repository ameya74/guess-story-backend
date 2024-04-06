import { IsString, Validate } from 'class-validator';
import { IsObjectId } from 'src/_common/decorators/ObjectId.decorator';
import { IsWalletAddress } from 'src/_common/decorators/walletAddress.decorator';

export class CreateUserDto {}

export class ConnectWalletDto {
  @IsString()
  @Validate(IsWalletAddress)
  walletAddress: string;
}

export class SingleUserDto {
  @Validate(IsObjectId)
  id: string;
}

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ethers } from 'ethers';

@ValidatorConstraint({ async: false })
export class IsWalletAddress implements ValidatorConstraintInterface {
  validate(text: string) {
    return ethers.isAddress(text.toLowerCase());
  }

  defaultMessage() {
    return 'wallet address not detected';
  }
}

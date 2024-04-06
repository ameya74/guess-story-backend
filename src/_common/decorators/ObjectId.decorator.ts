import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

@ValidatorConstraint({ async: false })
export class IsObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    console.log(text);
    if (text === null) return false;
    if (text === undefined) return false;

    return isValidObjectId(text);
  }

  defaultMessage() {
    return 'invalid _id';
  }
}

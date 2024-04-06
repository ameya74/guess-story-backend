import { UserDoc } from '../schema/user.schema';
import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';

export default class UserQueryService extends GenericQueryService<UserDoc> {
  constructor(model: Model<UserDoc>) {
    super(model, 'User');
  }
}

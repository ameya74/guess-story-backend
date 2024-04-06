import { UserDocument, modelName } from '../schema/user.schema';
import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';

export default class UserQueryService extends GenericQueryService<UserDocument> {
  constructor(model: Model<UserDocument>) {
    super(model, modelName);
  }
}

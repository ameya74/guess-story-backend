import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';
import { PostDocument, modelName } from '../schema/post.schema';

export default class PostQueryService extends GenericQueryService<PostDocument> {
  constructor(model: Model<PostDocument>) {
    super(model, modelName);
  }

  async getAllPosts() {
    return this.model.find().sort({ createdAt: -1 });
  }
}

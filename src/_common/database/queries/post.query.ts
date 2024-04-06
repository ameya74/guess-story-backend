import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';
import { PostDoc } from '../schema/post.schema';

export default class PostQueryService extends GenericQueryService<PostDoc> {
  constructor(model: Model<PostDoc>) {
    super(model, 'Post');
  }

  async getAllPosts() {
    return this.model.find().sort({ createdAt: -1 });
  }
}

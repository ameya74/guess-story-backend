import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';
import { CommentDocument, modelName } from '../schema/comment.schema';

export default class CommentQueryService extends GenericQueryService<CommentDocument> {
  constructor(model: Model<CommentDocument>) {
    super(model, modelName);
  }

  // get the top 10 comments for a post sorted by the highest rating
  async getTopComments(postId: string) {
    return this.model.find({ postId }).sort({ rating: -1 }).limit(10);
  }
}

import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';
import { CommentDoc } from '../schema/comment.schema';

export default class CommentQueryService extends GenericQueryService<CommentDoc> {
  constructor(model: Model<CommentDoc>) {
    super(model, 'Comment');
  }
}

import { Model } from 'mongoose';
import { GenericQueryService } from './_generic.query';
import { CommentDocument, modelName } from '../schema/comment.schema';

export default class CommentQueryService extends GenericQueryService<CommentDocument> {
  constructor(model: Model<CommentDocument>) {
    super(model, modelName);
  }
}

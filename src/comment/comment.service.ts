import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CommentQueryService from 'src/_common/database/queries/comment.query';
import PostQueryService from 'src/_common/database/queries/post.query';
import UserQueryService from 'src/_common/database/queries/user.query';
import { CommentDoc } from 'src/_common/database/schema/comment.schema';
import { PostDoc } from 'src/_common/database/schema/post.schema';
import { UserDoc } from 'src/_common/database/schema/user.schema';

@Injectable()
export class CommentService {
  commentQueryService: CommentQueryService;
  userQueryService: UserQueryService;
  postQueryService: PostQueryService;

  constructor(
    @InjectModel('Comment') CommentModel: Model<CommentDoc>,
    @InjectModel('Post') PostModel: Model<PostDoc>,
    @InjectModel('User') UserModel: Model<UserDoc>,
  ) {
    this.commentQueryService = new CommentQueryService(CommentModel);
    this.userQueryService = new UserQueryService(UserModel);
    this.postQueryService = new PostQueryService(PostModel);
  }

  async getRating(comment: string, postId: string) {
    const { backstory } = await this.postQueryService.readEntity({
      _id: postId,
    });

    return backstory;
  }

  async createComment(walletAddress: string, comment: string, postId: string) {
    const { _id } = await this.userQueryService.readEntity({ walletAddress });
    const rating = await this.getRating(comment, postId);
    const newComment = {
      userId: _id,
      postId,
      guessedBackstory: comment,
      rating,
    };
    return this.commentQueryService.createEntity(newComment);
  }

  async getAllCommentsforPost(postId: string) {
    return this.commentQueryService.readMultipleEntities({ postId });
  }
}

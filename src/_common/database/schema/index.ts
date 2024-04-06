import { ModelDefinition } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Post } from './post.schema';
import { Comment } from './comment.schema';

export const UsersModelDefs: Array<ModelDefinition> = [
  { name: 'User', schema: User },
];

export const PostModelDefs: Array<ModelDefinition> = [
  { name: 'Post', schema: Post },
];

export const CommentModelDefs: Array<ModelDefinition> = [
  { name: 'Comment', schema: Comment },
];

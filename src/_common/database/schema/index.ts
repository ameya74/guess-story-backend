import { ModelDefinition } from '@nestjs/mongoose';
import { UserSchema, modelName as UserModelName } from './user.schema';
import { PostSchema, modelName as PostModelName } from './post.schema';
import { CommentSchema, modelName as CommentModelName } from './comment.schema';

export const UsersModelDefs: Array<ModelDefinition> = [
  { name: UserModelName, schema: UserSchema },
  { name: PostModelName, schema: PostSchema },
  { name: CommentModelName, schema: CommentSchema },
];

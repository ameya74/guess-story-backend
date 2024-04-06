import { IsString, Validate } from 'class-validator';
import { IsObjectId } from 'src/_common/decorators/ObjectId.decorator';

export class CreateCommentDto {
  @IsString()
  story: string;

  @Validate(IsObjectId)
  id: string;
}

export class SingleCommentDto {
  @Validate(IsObjectId)
  id: string;
}

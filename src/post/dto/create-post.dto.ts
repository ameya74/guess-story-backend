import { IsDateString, IsString, Validate } from 'class-validator';
import { IsObjectId } from 'src/_common/decorators/ObjectId.decorator';

export class SinglePostDto {
  @Validate(IsObjectId)
  id: string;
}

export class CreatePostDto {
  @IsString()
  story: string;

  @IsDateString()
  endDate: string;
}

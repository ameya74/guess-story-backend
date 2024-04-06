import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { TRequestWithAuth } from 'src/_common/types.global';
import { AuthGuard } from 'src/_common/middleware/auth.guard';
import { SinglePostDto } from 'src/post/dto/create-post.dto';

@Controller({ path: 'comment', version: '1' })
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  createComment(
    @Req() req: TRequestWithAuth,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      req.walletAddress.toLowerCase(),
      createCommentDto.story,
      createCommentDto.id,
    );
  }

  @Get('all/:id')
  @UseGuards(AuthGuard)
  getAllComments(@Param() { id }: SinglePostDto) {
    return this.commentService.getAllCommentsforPost(id);
  }

  @Get('user-comment/:id')
  @UseGuards(AuthGuard)
  getUserComment(@Param() { id }: SinglePostDto, @Req() req: TRequestWithAuth) {
    return this.commentService.getUserComment(
      req.walletAddress.toLowerCase(),
      id,
    );
  }

  @Get('winners/:id')
  @UseGuards(AuthGuard)
  getWinnerComment(@Param() { id }: SinglePostDto) {
    return this.commentService.getWinners(id);
  }
}

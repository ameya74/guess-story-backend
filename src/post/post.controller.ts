import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { TRequestWithAuth } from 'src/_common/types.global';
import { AuthGuard } from 'src/_common/middleware/auth.guard';
import { CreatePostDto, SinglePostDto } from './dto/create-post.dto';

@Controller({ path: 'post', version: '1' })
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: TRequestWithAuth,
  ) {
    return this.postService.createPost(
      req.walletAddress.toLowerCase(),
      createPostDto,
    );
  }

  @Get('all')
  @UseGuards(AuthGuard)
  getAllPosts() {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getPost(@Param() { id }: SinglePostDto) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deletePost(@Param() { id }: SinglePostDto, @Req() req: TRequestWithAuth) {
    return this.postService.remove(id, req.walletAddress.toLowerCase());
  }
}

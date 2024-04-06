import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { HttpModule } from '@nestjs/axios';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModelDefs } from 'src/_common/database/schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PostController } from 'src/post/post.controller';
import { UsersModule } from 'src/users/users.module';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    CommentModule,
    MongooseModule.forFeature(UsersModelDefs),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXP_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PostController, CommentController],
  providers: [PostService, CommentService, UsersService],
  exports: [JwtModule],
})
export class CommentModule {}

import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { HttpModule } from '@nestjs/axios';
import { CommentService } from 'src/comment/comment.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModelDefs } from 'src/_common/database/schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { CommentModule } from 'src/comment/comment.module';

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
  controllers: [PostController],
  providers: [PostService, CommentService, UsersService],
  exports: [JwtModule],
})
export class PostModule {}

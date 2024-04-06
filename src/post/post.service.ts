import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PostQueryService from 'src/_common/database/queries/post.query';
import UserQueryService from 'src/_common/database/queries/user.query';
import { PostDoc } from 'src/_common/database/schema/post.schema';
import { UserDoc } from 'src/_common/database/schema/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  ImageApiUrl: string;
  postQueryService: PostQueryService;
  userQueryService: UserQueryService;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectModel('Post') PostModel: Model<PostDoc>,
    @InjectModel('User') UserModel: Model<UserDoc>,
  ) {
    this.httpService = httpService;
    this.configService = configService;
    this.ImageApiUrl = this.configService.get<string>('IMAGE_API_URL');
    this.postQueryService = new PostQueryService(PostModel);
    this.userQueryService = new UserQueryService(UserModel);
  }

  genAI = new GoogleGenerativeAI(
    this.configService.get<string>('GOOGLE_API_KEY'),
  );

  async generate5prompts(story: string): Promise<string[]> {
    // TODO: logic to generate images from the 5 prompts
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    const prompt = `Based on a provided story, generate 5 descriptive prompts suitable for image creation. Each prompt should capture a pivotal moment or element from the story. These prompts should enable anyone viewing the resulting images to infer and piece together the narrative of the original story. Please format your prompts as a JavaScript list, don't add any other character because I will extract the list afterwards, like so: 
    [
            "Description of image related to a key event in the story.",
            "Description of another significant scene or item.",
            "Description highlighting a character or setting from the story.",
            "Description of an emotional or climactic moment.",
            "Description capturing a crucial detail or element from the story."
    ]

            The story is: "${story}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    try {
      const parsedArray = JSON.parse(response.text());
      if (Array.isArray(parsedArray) && parsedArray.length >= 5) {
        return parsedArray.slice(0, 5);
      } else {
        throw new Error(
          'Input is not a valid JSON array or does not contain at least 5 strings.',
        );
      }
    } catch (error) {
      console.error('Error parsing input:', error);
      return [];
    }
  }

  async generateImages(prompts: string) {
    // TODO: logic to generate images from the prompts
    // const imagePrompts: string[] = await this.generate5prompts(prompts);
  }

  async createPost(walletAddress: string, prompt: string) {
    const images = await this.generateImages(prompt);
    const { _id } = await this.userQueryService.readEntity({ walletAddress });
    // TODO: logic to add rewards
    const newPost = {
      images,
      createdBy: _id,
      backstory: prompt,
    };

    const post = await this.postQueryService.createEntity(newPost);
    return post;
  }

  async findAll() {
    return this.postQueryService.getAllPosts();
  }

  async findOne(id: string) {
    return this.postQueryService.readEntity({ _id: id });
  }

  async remove(id: string) {
    return this.postQueryService.deleteEntity({ _id: id });
  }
}
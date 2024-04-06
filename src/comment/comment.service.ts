import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import CommentQueryService from 'src/_common/database/queries/comment.query';
import PostQueryService from 'src/_common/database/queries/post.query';
import UserQueryService from 'src/_common/database/queries/user.query';
import { CommentDocument } from 'src/_common/database/schema/comment.schema';
import { PostDocument } from 'src/_common/database/schema/post.schema';
import { UserDocument } from 'src/_common/database/schema/user.schema';

@Injectable()
export class CommentService {
  commentQueryService: CommentQueryService;
  userQueryService: UserQueryService;
  postQueryService: PostQueryService;

  constructor(
    private configService: ConfigService,
    @InjectModel('Comment') CommentModel: Model<CommentDocument>,
    @InjectModel('Post') PostModel: Model<PostDocument>,
    @InjectModel('User') UserModel: Model<UserDocument>,
  ) {
    this.commentQueryService = new CommentQueryService(CommentModel);
    this.userQueryService = new UserQueryService(UserModel);
    this.postQueryService = new PostQueryService(PostModel);
  }

  genAI = new GoogleGenerativeAI(
    this.configService.get<string>('GOOGLE_API_KEY'),
  );

  /**
   * Calculates the rating for two given stories based on ten distinct parameters.
   * The rating is determined by analyzing the similarity and differences between the stories.
   *
   * @param originalStory - The original story to be rated.
   * @param generatedStory - The generated story to be rated.
   * @returns A Promise that resolves to the rating of the stories.
   */

  private getRatingHandler = async (
    originalStory: string,
    generatedStory: string,
  ) => {
    // Initialize the generative model
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    // Create the prompt string
    const prompt = `
    Rate two given stories on a scale of 0 to 1000 across ten distinct parameters to determine their similarity and differences:

    Please analyze the following two stories based on the provided parameters and assign a rating between 0 to 1000 for each parameter, totaling 100 points per parameter. Add up the ratings for all parameters to provide a single, consolidated score. Ensure no additional content or alterations are made to the input.

    Parameters for Comparison:

    Theme: Evaluate the central message or moral of each story. Determine if both stories revolve around similar themes or topics.

    Plot Structure: Assess the similarity in plot elements such as introduction, rising action, climax, and resolution.

    Characters: Compare the characters in both stories. Examine if their roles and characteristics are similar.

    Setting: Analyze the setting of each story. Determine if the settings are comparable or relevant to the plot.

    Tone and Mood: Determine the emotions evoked by each story. Evaluate if the overall tone (e.g., humorous, dramatic, suspenseful) and mood (e.g., happy, sad, mysterious) are similar.

    Narrative Style: Examine the storytelling approach in each story (e.g., first-person, third-person, past tense, present tense). Evaluate consistency between the two.

    Language and Vocabulary: Identify common phrases, descriptive language, or vocabulary used in both stories.

    Length and Structure: Compare the length and structure of the stories. Assess if they follow a similar format.

    Symbolism and Motifs: Evaluate if both stories employ similar symbols, motifs, or recurring themes to convey messages.

    Audience and Purpose: Determine the intended audience for each story and the message or purpose the authors aim to convey.
    
    Input Format:
    
    story1: [${originalStory}]
    story2: [${generatedStory}]

    Desired Output Format:

    A single string containing the total score.

    `;

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Retrieve the response
    const response = await result.response;

    // Parse the rating from the response
    const rating = parseInt(response.text());

    // Log the rating
    console.log(rating);

    // Return the rating
    return rating;
  };

  async getRating(comment: string, postId: string) {
    const { backstory } = await this.postQueryService.readEntity({
      _id: postId,
    });

    const rating = await this.getRatingHandler(backstory, comment);

    return rating;
  }

  async createComment(walletAddress: string, comment: string, postId: string) {
    const commentLength = comment.trim().split(/\s+/).length;
    const isValidLength = commentLength >= 50 && commentLength <= 200;

    if (!isValidLength) {
      return {
        success: false,
        message: 'Comment must be between 50 and 200 words.',
      };
    }

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

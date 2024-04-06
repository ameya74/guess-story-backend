import { BadRequestException, Logger } from '@nestjs/common';
import { Document, Model } from 'mongoose';

export class GenericQueryService<T extends Document> {
  model: Model<T>;

  modelName: string;

  logger: Logger;

  constructor(model: Model<T>, modelName: string) {
    this.logger = new Logger(`${modelName}Service`);
    this.model = model;
    this.modelName = modelName;
  }

  async createEntity(data: any): Promise<T> {
    return this.model.create(data);
  }

  async readEntity(
    identifier: object,
    options: object = {},
    displayFields: object = {},
  ): Promise<T> {
    if (await this.checkValidity(identifier)) {
      return this.model.findOne(
        identifier,
        {
          createdOn: 0,
          updatedOn: 0,
          ...displayFields,
        },
        options,
      );
    }
    throw new BadRequestException(`${this.modelName} not found`);
  }

  async updateEntity(identifier: object, data: object): Promise<boolean> {
    if (await this.checkValidity(identifier)) {
      await this.model.findOneAndUpdate(identifier, data);
      return Promise.resolve(true);
    }
    throw new BadRequestException(`${this.modelName} not found`);
  }

  async updateMultipleEntities(
    identifier: object,
    data: object,
  ): Promise<boolean> {
    if (await this.checkValidity(identifier)) {
      await this.model.updateMany(identifier, data);
      return Promise.resolve(true);
    }
    throw new BadRequestException(`${this.modelName} not found`);
  }

  async updateAndReturnEntity(identifier: object, data: object): Promise<any> {
    if (await this.checkValidity(identifier)) {
      const updatedDocument = await this.model.findOneAndUpdate(
        identifier,
        data,
        { new: true },
      );
      return updatedDocument;
    }
    throw new BadRequestException(`${this.modelName} not found`);
  }

  async deleteEntity(identifier: object): Promise<boolean> {
    if (await this.checkValidity(identifier)) {
      await this.model.findByIdAndDelete(identifier);
      return Promise.resolve(true);
    }
    throw new BadRequestException(`${this.modelName} not found`);
  }

  async checkValidity(identifier: object): Promise<boolean> {
    const exists = await this.model.exists(identifier);
    if (!exists) return Promise.resolve(false);
    return Promise.resolve(true);
  }

  async readMultipleEntities(
    identifier: object,
    options: object = {},
    displayFields: object = {},
  ): Promise<T[]> {
    const data = await this.model.find(
      identifier,
      {
        createdOn: 0,
        updatedOn: 0,
        ...displayFields,
      },
      options,
    );
    if (data.length === 0) {
      throw new BadRequestException(`${this.modelName} not found`);
    }
    return data;
  }
}

import { ObjectId } from 'mongoose';
import { Request } from 'express';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

type AuthPayload = {
  walletAddress: string;
  userId: ObjectId;
};

export type TRequestWithAuth = Request & AuthPayload;

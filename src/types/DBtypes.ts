import {Document, Types} from 'mongoose';

type User = Partial<Document> & {
    id: Types.ObjectId | string;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    isFollowing: Category[] | Types.ObjectId[];
}

type Category = Partial<Document> & {
  id: Types.ObjectId | string;
  name: string;
};

type LoginUser = Omit<User, 'password' | 'isFollowing'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};

type UserOutput = Omit<User, 'password' | 'role' | 'isFollowing'>;

type UserInput = Omit<User, 'id' | 'role'>;

export {User, LoginUser, TokenContent, UserOutput, UserInput, Category};

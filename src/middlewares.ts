import {NextFunction, Request, Response} from 'express';
import CustomError from './classes/CustomError';
import jwt from 'jsonwebtoken';
import userModel from './api/models/userModel';
import {ErrorResponse, MessageResponse} from './types/MessageTypes';
import {LoginUser, TokenContent, UserOutput} from './types/DBtypes';

const itWorks = (req: Request, res: Response, next: NextFunction) => {
  const message: MessageResponse = {
    message: 'It works!',
  };
  next(message);
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const token = bearer.split(' ')[1];
    if (!token || token === 'undefined') {
      next(new CustomError('No token provided', 401));
      return;
    }

    const userFromToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as LoginUser;

    const user = await userModel.findById(userFromToken.id).select('-password');
    if (!user) {
      next(new CustomError('Token not valid', 404));
      return;
    }

    const outputUser: LoginUser = {
      username: user.username,
      email: user.email,
      id: user.id,
      role: user.role,
    };

    res.locals.userFromToken = outputUser;
    next();
  } catch (err) {
    next(err);
  }
};

export {authenticate, itWorks};

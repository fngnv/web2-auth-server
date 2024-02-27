import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel';
import {LoginUser, User, UserInput, UserOutput} from '../../types/DBtypes';
import {UserResponse} from '../../types/MessageTypes';

const salt = bcrypt.genSaltSync(10);

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userModel.find().select('-password -role');
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const userGet = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userModel
            .findById(req.params.id)
            .select('-password -role');
        if (!user) {
            next(new CustomError('User not found', 404));
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const userPost = async (
    req: Request<{}, {}, UserInput>,
    res: Response,
    next: NextFunction
) => {
  try {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, salt);
    const newUser = await userModel.create(user);
    const response: UserResponse = {
      message: 'User created',
      user: {
        username: newUser.username,
        email: newUser.email,
        id: newUser._id,
      },
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const userPut = async (
    req: Request<{id?: string}, {}, UserInput>,
    res: Response<UserResponse, {userFromToken: LoginUser}>,
    next: NextFunction
) => {
  try {
    const {userFromToken} = res.locals;

    let id = userFromToken.id;
    if (userFromToken.role === 'admin' && req.params.id) {
      id = req.params.id;
    }
    const result = await userModel
      .findByIdAndUpdate(id, req.body, {new: true})
      .select('-password -role');

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: UserResponse = {
      message: 'User updated',
      user: {
        username: result.username,
        email: result.email,
        id: result._id,
      },
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const userDelete = async (
    req: Request<{id?: string}>,
    res: Response<UserResponse, {userFromToken: LoginUser}>,
    next: NextFunction
) => {
  try {
    const {userFromToken} = res.locals;

    let id;

    if (userFromToken.role === 'admin' && req.params.id) {
      id = req.params.id;
    }

    if (userFromToken.role === 'user') {
      id = userFromToken.id;
    }

    const result = await userModel
      .findByIdAndDelete(id)
      .select('-password -role');

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: UserResponse = {
      message: 'User deleted',
      user: {
        username: result.username,
        email: result.email,
        id: result._id,
      },
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

const checkToken = async(
  req: Request,
  res: Response<UserResponse, {userFromToken: LoginUser}>,
  next: NextFunction,
) => {
  try {
    const userData: UserOutput = await userModel
      .findById(res.locals.userFromToken.id)
      .select('-password -role');

    if (!userData) {
      next(new CustomError('Session not found', 404));
      return;
    }

    const response: UserResponse = {
      message: 'Token is valid',
      user: userData,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

export {userListGet, userGet, userPost, userPut, userDelete, checkToken};

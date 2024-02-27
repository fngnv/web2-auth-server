import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import CustomError from '../../classes/CustomError';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import {TokenResponse} from '../../types/MessageTypes';
import { LoginUser } from '../../types/DBtypes';

const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    console.log('USERNAME AND PASSWORD IN AUTHCONTROLLER', email, password);

    const user = await userModel.findOne({email: email});

    if(!user) {
        next(new CustomError('Invalid credentials', 403));
        return;
    }

    const tokenContent: LoginUser = {
        username: user.username,
        email: user.email,
        id: user._id,
        role: user.role,
    }

    const token = jwt.sign(tokenContent, process.env.JWT_SECRET as string);
    const msg: TokenResponse = {
        token,
        message: 'Login successful',
        user: {
            username: user.username,
            email: user.email,
            id: user._id,
        },
    };
    return res.json(msg);
};

export default login;
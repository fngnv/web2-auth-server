import {UserOutput} from './DBtypes';

type MessageResponse = {
    message: string;
}

type ErrorResponse = MessageResponse & {
    stack?: string;
}

type UserResponse = MessageResponse & {
    user: UserOutput;
}

type TokenResponse = MessageResponse & {
    token: string;
    user: UserOutput;
}

export {MessageResponse, ErrorResponse, UserResponse, TokenResponse}
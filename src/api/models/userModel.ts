import mongoose from "mongoose";
import {User} from "../../types/DBtypes";

const userModel = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
    },
});

// Add virtual id field, more explanation later
userModel.virtual('id').get(function () {
    return this._id.toHexString();
});

userModel.set('toJSON', {
    virtuals: true,
  });

  export default mongoose.model<User>('User', userModel);
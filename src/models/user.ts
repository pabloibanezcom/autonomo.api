import { User } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import { ModelName } from './modelName';
import UserBusiness from './UserBusiness';

export const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean },
  defaultBusiness: { type: Schema.Types.ObjectId, ref: ModelName.Business },
  businesses: { type: [UserBusiness] },
  person: { type: Schema.Types.ObjectId, ref: ModelName.Person, required: true }
});

export default mongoose.model<User>(ModelName.User, UserSchema);

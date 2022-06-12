import { User } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import UserBusiness from './UserBusiness';

export const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean },
  defaultBusiness: { type: Schema.Types.ObjectId, ref: 'Business' },
  businesses: { type: [UserBusiness] },
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true }
});

export default mongoose.model<User>('User', UserSchema);

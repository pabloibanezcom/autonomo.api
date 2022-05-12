import { User } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import Address from './address';

export const UserSchema: Schema = new Schema({
  isAdmin: { type: Boolean },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  nif: { type: String },
  gender: { type: String },
  picture: { type: String },
  color: { type: String },
  address: { type: Address },
  defaultBusiness: { type: Schema.Types.ObjectId, ref: 'Business' }
});

export default mongoose.model<User>('User', UserSchema);

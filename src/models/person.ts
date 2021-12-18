import { Person } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const PersonSchema: Schema = new Schema({
  auth0UserId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  nif: { type: String },
  gender: { type: String },
  picture: { type: String }
});

export default mongoose.model<Person>('Person', PersonSchema);

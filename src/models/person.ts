import { Person } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import Address from './address';

export const PersonSchema: Schema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  nif: { type: String },
  gender: { type: String },
  picture: { type: String },
  color: { type: String },
  address: { type: Address }
});

export default mongoose.model<Person>('Person', PersonSchema);

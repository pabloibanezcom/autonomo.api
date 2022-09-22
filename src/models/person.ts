import { Person } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import Address from './address';
import File from './file';
import { ModelName } from './modelName';

export const PersonSchema: Schema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    nif: { type: String },
    gender: { type: String },
    picture: { type: File },
    color: { type: String },
    address: { type: Address }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

PersonSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (v) {
    const firstName = v.substring(0, v.indexOf(' '));
    const lastName = v.substring(v.indexOf(' ') + 1);
    this.set({ firstName, lastName });
  });

export default mongoose.model<Person>(ModelName.Person, PersonSchema);

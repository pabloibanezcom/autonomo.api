import { Business } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

const AuthorisedPerson = {
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  grantType: { type: String, required: true, enum: ['View', 'Write', 'Admin'] }
};

export const BusinessSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['company', 'sole-trader'] },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  soleTrader: { type: Schema.Types.ObjectId, ref: 'Person' },
  authorisedPeople: { type: [AuthorisedPerson], required: true }
});

export default mongoose.model<Business>('Business', BusinessSchema);

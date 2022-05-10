import { Company } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import Address from './address';

export const CompanySchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  country: { type: String },
  cifVat: { type: String },
  address: { type: Address },
  director: { type: Schema.Types.ObjectId, ref: 'Person' },
  defaultCurrency: { type: String }
});

export default mongoose.model<Company>('Company', CompanySchema);

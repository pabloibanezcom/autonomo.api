import { Company } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import Address from './address';
import InvoicesStats from './invoicesStats';
import { ModelName } from './modelName';

export const CompanySchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business, required: true },
  name: { type: String, required: true },
  country: { type: String },
  cifVat: { type: String },
  address: { type: Address },
  creationDate: { type: Date },
  director: { type: Schema.Types.ObjectId, ref: ModelName.Person },
  defaultCurrency: { type: String },
  color: { type: String },
  invoicesIssuedStats: { type: InvoicesStats },
  invoicesReceivedStats: { type: InvoicesStats }
});

export default mongoose.model<Company>(ModelName.Company, CompanySchema);

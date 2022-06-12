import { Business } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import BusinessPerson from './businessPerson';
import ExchangeRate from './exchangeRate';

export const BusinessSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['company', 'sole-trader'] },
  country: { type: String, required: true },
  defaultCurrency: { type: String },
  exchangeRates: { type: [ExchangeRate] },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  soleTrader: { type: Schema.Types.ObjectId, ref: 'Person' },
  people: { type: [BusinessPerson], required: true },
  nextInvoiceNumber: { type: String, required: true },
  natureOfBusiness: { type: String }
});

export default mongoose.model<Business>('Business', BusinessSchema);

import { Business, BusinessType, getEnumArray } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import BusinessPerson from './businessPerson';
import ExchangeRate from './exchangeRate';
import { ModelName } from './modelName';

export const BusinessSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: getEnumArray(BusinessType) },
  country: { type: String, required: true },
  defaultCurrency: { type: String },
  exchangeRates: { type: [ExchangeRate] },
  company: { type: Schema.Types.ObjectId, ref: ModelName.Company },
  soleTrader: { type: Schema.Types.ObjectId, ref: ModelName.Person },
  people: { type: [BusinessPerson], required: true },
  nextInvoiceNumber: { type: String, required: true },
  natureOfBusiness: { type: String }
});

export default mongoose.model<Business>(ModelName.Business, BusinessSchema);

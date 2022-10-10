import { Business, BusinessType, getEnumArray } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import BusinessPerson from './businessPerson';
import ExchangeRate from './exchangeRate';
import { ModelName } from './modelName';

export const BusinessSchema: Schema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: getEnumArray(BusinessType) },
  country: { type: String, required: true },
  defaultCurrency: { type: String },
  exchangeRates: { type: [ExchangeRate] },
  company: { type: Schema.Types.ObjectId, ref: ModelName.Company },
  soleTrader: { type: Schema.Types.ObjectId, ref: ModelName.Person },
  tradingStartDate: { type: Date },
  people: { type: [BusinessPerson], required: true },
  currentTaxYear: { type: Schema.Types.ObjectId, ref: ModelName.TaxYear },
  nextInvoiceNumber: { type: String, required: true },
  natureOfBusiness: { type: String }
});

export default mongoose.model<Business>(ModelName.Business, BusinessSchema);

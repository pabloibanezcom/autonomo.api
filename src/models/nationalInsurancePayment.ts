import { NationalInsurancePayment } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';
import { ModelName } from './modelName';

export const NationalInsurancePaymentSchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business, required: true },
  person: { type: Schema.Types.ObjectId, ref: ModelName.Person, required: true },
  date: { type: Date, required: true },
  amount: { type: CurrencyAmount, required: true },
  description: { type: String }
});

export default mongoose.model<NationalInsurancePayment>(
  ModelName.NationalInsurancePayment,
  NationalInsurancePaymentSchema
);

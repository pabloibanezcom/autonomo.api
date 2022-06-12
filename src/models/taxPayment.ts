import { getEnumArray, TaxPayment, TaxType } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';
import { ModelName } from './modelName';

export const TaxPaymentSchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business, required: true },
  taxYear: { type: Schema.Types.ObjectId, ref: ModelName.TaxYear, required: true },
  type: { type: String, required: true, enum: getEnumArray(TaxType) },
  date: { type: Date, required: true },
  amount: { type: CurrencyAmount, required: true },
  description: { type: String }
});

export default mongoose.model<TaxPayment>(ModelName.TaxPayment, TaxPaymentSchema);

import { TaxPayment } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import AmountCurrency from './amountCurrency';

export const TaxPaymentSchema: Schema = new Schema({
  payer: { type: Schema.Types.ObjectId, refPath: 'payerType', required: true },
  payerType: { type: String, required: true, enum: ['Company', 'Person'] },
  taxYear: { type: Schema.Types.ObjectId, ref: 'TaxYear', required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: AmountCurrency, required: true },
  description: { type: String }
});

export default mongoose.model<TaxPayment>('TaxPayment', TaxPaymentSchema);

import { TaxPayment } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import CurrencyAmount from './CurrencyAmount';

export const TaxPaymentSchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  taxYear: { type: Schema.Types.ObjectId, ref: 'TaxYear', required: true },
  type: { type: String, required: true, enum: ['incomeTax', 'dividendsTax', 'VAT'] },
  date: { type: Date, required: true },
  amount: { type: CurrencyAmount, required: true },
  description: { type: String }
});

export default mongoose.model<TaxPayment>('TaxPayment', TaxPaymentSchema);

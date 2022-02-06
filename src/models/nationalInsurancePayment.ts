import { NationalInsurancePayment } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import AmountCurrency from './amountCurrency';

export const NationalInsurancePaymentSchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  date: { type: Date, required: true },
  amount: { type: AmountCurrency, required: true },
  description: { type: String }
});

export default mongoose.model<NationalInsurancePayment>('NationalInsurancePayment', NationalInsurancePaymentSchema);

import { Expense } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';
import InvoiceModel from './invoice';

export const ExpenseSchema: Schema = new Schema({
  ...InvoiceModel,
  issuer: { type: Schema.Types.ObjectId, ref: 'Company' },
  deductibleTaxPct: { type: Number },
  deductibleTax: { type: CurrencyAmount },
  isDeductible: { type: Boolean, required: true }
});

export default mongoose.model<Expense>('Expense', ExpenseSchema);

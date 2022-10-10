import { Expense } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';
import InvoiceModel from './invoice';
import { ModelName } from './modelName';

export const ExpenseSchema: Schema = new Schema({
  ...InvoiceModel,
  issuer: { type: Schema.Types.ObjectId, ref: ModelName.Company },
  tags: [{ type: Schema.Types.ObjectId, ref: ModelName.Tag }],
  deductibleTaxPct: { type: Number },
  deductibleTax: { type: CurrencyAmount },
  isDeductible: { type: Boolean, required: true }
});

export default mongoose.model<Expense>(ModelName.Expense, ExpenseSchema);

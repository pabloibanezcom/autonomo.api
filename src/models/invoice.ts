import { Invoice } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import CurrencyAmount from './CurrencyAmount';
import File from './file';

const ProductOrService = {
  descriptionLine1: { type: String, required: true },
  descriptionLine2: { type: String },
  quantity: { type: Number, required: true },
  unitPrice: { type: CurrencyAmount, required: true },
  subtotal: { type: CurrencyAmount, required: true },
  taxPct: { type: Number, required: true },
  tax: { type: CurrencyAmount, required: true },
  total: { type: CurrencyAmount, required: true }
};

export const InvoiceSchema: Schema = new Schema({
  number: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: 'Business' },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  issuerOrClient: { type: Schema.Types.ObjectId, ref: 'Company' },
  issuedDate: { type: Date, required: true },
  paymentDate: { type: Date },
  productsOrServices: [ProductOrService],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  baseCurrency: { type: String, required: true },
  subtotal: { type: CurrencyAmount, required: true },
  subtotalBaseCurrency: { type: CurrencyAmount },
  taxPct: { type: Number, required: true },
  tax: { type: CurrencyAmount, required: true },
  taxBaseCurrency: { type: CurrencyAmount },
  deductibleTaxPct: { type: Number },
  deductibleTax: { type: CurrencyAmount },
  isDeductible: { type: Boolean },
  total: { type: CurrencyAmount, required: true },
  totalBaseCurrency: { type: CurrencyAmount },
  file: { type: File }
});

export default mongoose.model<Invoice>('Invoice', InvoiceSchema);

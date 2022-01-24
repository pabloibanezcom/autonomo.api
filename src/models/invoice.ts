import { Invoice } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import AmountCurrency from './amountCurrency';
import File from './file';

const DescriptionElement = {
  descriptionLine1: { type: String },
  descriptionLine2: { type: String },
  quantity: { type: String },
  unitPrice: AmountCurrency
};

export const InvoiceSchema: Schema = new Schema({
  number: { type: String, required: true },
  issuer: { type: Schema.Types.ObjectId, refPath: 'issuerType', required: true },
  issuerType: { type: String, required: true, enum: ['Company', 'Person'] },
  client: { type: Schema.Types.ObjectId, refPath: 'clientType', required: true },
  clientType: { type: String, required: true, enum: ['Company', 'Person'] },
  issuedDate: { type: Date, required: true },
  paymentDate: { type: Date },
  description: [DescriptionElement],
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  subtotal: { type: AmountCurrency, required: true },
  taxPct: { type: Number, required: true },
  tax: { type: AmountCurrency, required: true },
  deductibleTaxPct: { type: Number },
  deductibleTax: { type: AmountCurrency },
  total: { type: AmountCurrency, required: true },
  totalOthers: [AmountCurrency],
  file: { type: File }
});

export default mongoose.model<Invoice>('Invoice', InvoiceSchema);

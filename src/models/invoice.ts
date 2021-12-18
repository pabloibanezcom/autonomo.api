import { Invoice } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const InvoiceSchema: Schema = new Schema({
  number: { type: String, required: true },
  to: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  issued_date: { type: Date, required: true },
  payment_date: { type: Date },
  description: {
    description_line_1: { type: String },
    description_line_2: { type: String },
    quantity: { type: String },
    unit_price: { type: Number },
    unit_price_currency: { type: String }
  },
  tax_base: { type: Number, required: true },
  tax_base_currency: { type: String, required: true },
  tax_pct: { type: Number, required: true },
  tax: { type: Number, required: true },
  tax_currency: { type: String, required: true },
  total: { type: Number, required: true },
  total_currency: { type: String, required: true },
  total_euro: { type: Number, required: true },
  currency_rate: { type: Number }
});

export default mongoose.model<Invoice>('Invoice', InvoiceSchema);

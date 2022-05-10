import { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';

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

export default new Schema(ProductOrService, { _id: false });

import { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';
import File from './file';
import { ModelName } from './modelName';
import ProductOrService from './productOrService';

export const InvoiceModel = {
  number: { type: String },
  description: { type: String },
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business },
  issuedDate: { type: Date, required: true },
  paymentDate: { type: Date },
  productsOrServices: [ProductOrService],
  categories: [{ type: Schema.Types.ObjectId, ref: ModelName.Category }],
  baseCurrency: { type: String, required: true },
  exchangeRate: { type: Number },
  subtotal: { type: CurrencyAmount, required: true },
  subtotalBaseCurrency: { type: CurrencyAmount },
  taxPct: { type: Number, required: true },
  tax: { type: CurrencyAmount, required: true },
  taxBaseCurrency: { type: CurrencyAmount },
  total: { type: CurrencyAmount, required: true },
  totalBaseCurrency: { type: CurrencyAmount },
  file: { type: File }
};

export default InvoiceModel;

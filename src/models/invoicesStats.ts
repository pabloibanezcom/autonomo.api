import { Schema } from 'mongoose';
import CurrencyAmount from './currencyAmount';

const InvoicesStats = {
  quantity: { type: Number, required: true },
  last: { type: Date },
  total: { type: CurrencyAmount }
};

export default new Schema(InvoicesStats, { _id: false });

import { Schema } from 'mongoose';

const CurrencyAmount = {
  amount: { type: Number, required: true },
  currency: { type: String, required: true }
};

export default new Schema(CurrencyAmount, { _id: false });

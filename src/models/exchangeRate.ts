import { Schema } from 'mongoose';

const ExchangeRate = {
  currencyFrom: { type: String, required: true },
  currencyTo: { type: String, required: true },
  rate: { type: Number, required: true }
};

export default new Schema(ExchangeRate, { _id: false });

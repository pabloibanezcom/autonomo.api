import { TaxYear } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

const TaxBand = {
  start: { type: Number, required: true },
  end: { type: Number },
  rate: { type: Number, required: true }
};

const TaxDefinition = {
  name: { type: String, required: true },
  description: { type: String },
  taxBands: { type: [TaxBand], required: true }
};

export const TaxYearSchema: Schema = new Schema({
  country: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  incomeTax: { type: TaxDefinition, required: true },
  dividendsTax: { type: TaxDefinition, required: true }
});

export default mongoose.model<TaxYear>('TaxYear', TaxYearSchema);

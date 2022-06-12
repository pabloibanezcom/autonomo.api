import { TaxYear } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import { ModelName } from './modelName';

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
  name: { type: String, required: true },
  country: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  incomeTax: { type: TaxDefinition, required: true, _id: false },
  dividendsTax: { type: TaxDefinition, required: true, _id: false },
  vatBands: { type: [Number], required: true }
});

export default mongoose.model<TaxYear>(ModelName.TaxYear, TaxYearSchema);

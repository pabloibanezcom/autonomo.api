import { Income } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import InvoiceModel from './invoice';
import { ModelName } from './modelName';

export const IncomeSchema: Schema = new Schema({
  ...InvoiceModel,
  client: { type: Schema.Types.ObjectId, ref: ModelName.Company }
});

export default mongoose.model<Income>(ModelName.Income, IncomeSchema);

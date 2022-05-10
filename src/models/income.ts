import { Income } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import InvoiceModel from './invoice';

export const IncomeSchema: Schema = new Schema({
  ...InvoiceModel,
  client: { type: Schema.Types.ObjectId, ref: 'Company' }
});

export default mongoose.model<Income>('Income', IncomeSchema);

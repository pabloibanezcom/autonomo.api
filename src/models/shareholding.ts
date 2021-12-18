import { Shareholding } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const ShareholdingSchema: Schema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  shareholder: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  percentage: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date }
});

export default mongoose.model<Shareholding>('Shareholding', ShareholdingSchema);

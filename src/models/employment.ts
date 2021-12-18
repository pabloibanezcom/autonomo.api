import { Employment } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const EmploymentSchema: Schema = new Schema({
  employer: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  employee: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  salary: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date }
});

export default mongoose.model<Employment>('Employment', EmploymentSchema);

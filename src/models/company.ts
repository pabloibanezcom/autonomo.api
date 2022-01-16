import { Company } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  cifVat: { type: String },
  address: { type: Object },
  director: { type: Schema.Types.ObjectId, ref: 'Person' },
  shareholdings: [{ type: Schema.Types.ObjectId, ref: 'Shareholding' }]
});

export default mongoose.model<Company>('Company', CompanySchema);

import { Company } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  cif_vat: { type: String, required: true },
  address: { type: Object },
  director: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  shareholdings: [{ type: Schema.Types.ObjectId, ref: 'Shareholding' }]
});

export default mongoose.model<Company>('Company', CompanySchema);

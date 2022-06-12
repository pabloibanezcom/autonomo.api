import { Schema } from 'mongoose';

const BusinessPerson = {
  person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  role: { type: String, required: true, enum: ['SoleTrader', 'Director', 'Accountant'] },
  since: { type: Date }
};

export default new Schema(BusinessPerson, { _id: false });

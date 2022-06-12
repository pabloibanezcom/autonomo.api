import { BusinessRole, getEnumArray } from '@autonomo/common';
import { Schema } from 'mongoose';
import { ModelName } from './modelName';

const BusinessPerson = {
  person: { type: Schema.Types.ObjectId, ref: ModelName.Person, required: true },
  role: { type: String, required: true, enum: getEnumArray(BusinessRole) },
  since: { type: Date }
};

export default new Schema(BusinessPerson, { _id: false });

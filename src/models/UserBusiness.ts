import { BusinessRole, getEnumArray, GrantType } from '@autonomo/common';
import { Schema } from 'mongoose';
import { ModelName } from './modelName';

const UserBusiness = {
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business, required: true },
  grantType: { type: String, required: true, enum: getEnumArray(GrantType) },
  role: { type: String, required: true, enum: getEnumArray(BusinessRole) }
};

export default new Schema(UserBusiness, { _id: false });

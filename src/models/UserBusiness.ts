import { Schema } from 'mongoose';

const UserBusiness = {
  business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  grantType: { type: String, required: true, enum: ['View', 'Write', 'Admin'] },
  role: { type: String, required: true, enum: ['Director', 'Accountant'] }
};

export default new Schema(UserBusiness, { _id: false });

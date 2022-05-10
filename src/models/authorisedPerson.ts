import { Schema } from 'mongoose';

const AuthorisedPerson = {
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  grantType: { type: String, required: true, enum: ['View', 'Write', 'Admin'] }
};

export default new Schema(AuthorisedPerson, { _id: false });

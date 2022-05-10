import { Schema } from 'mongoose';

const Address = {
  line1: { type: String, required: true },
  line2: { type: String },
  line3: { type: String },
  postalCode: { type: String, required: true },
  town: { type: String, required: true },
  country: { type: String, required: true }
};

export default new Schema(Address, { _id: false });

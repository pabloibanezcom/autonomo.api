import { Schema } from 'mongoose';

const File = {
  eTag: { type: String, required: true },
  key: { type: String, required: true },
  location: { type: String, required: true }
};

export default new Schema(File, { _id: false });

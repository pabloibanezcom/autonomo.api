import { Category } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';

export const CategorySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  type: { type: String, required: true }
});

export default mongoose.model<Category>('Category', CategorySchema);

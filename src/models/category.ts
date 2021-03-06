import { Category } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import { ModelName } from './modelName';

export const CategorySchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  altColor: { type: String, required: true },
  type: { type: String, required: true }
});

export default mongoose.model<Category>(ModelName.Category, CategorySchema);

import { Tag } from '@autonomo/common';
import mongoose, { Schema } from 'mongoose';
import { ModelName } from './modelName';

export const TagSchema: Schema = new Schema({
  business: { type: Schema.Types.ObjectId, ref: ModelName.Business, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  altColor: { type: String, required: true }
});

export default mongoose.model<Tag>(ModelName.Tag, TagSchema);

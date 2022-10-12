import { generateAltColor, generateRandomColor, Tag } from '@autonomo/common';
import { Types } from 'mongoose';
import TagDB from '../../src/models//tag';
import { addTagWithoutAuth } from '../../src/services/tag';

const getTagsByName = async (tags: string[], business: string): Promise<Tag[]> => {
  const result: Tag[] = [];
  for (const tagName of tags) {
    if (tagName) {
      result.push((await getTagOrCreate(tagName, business)) as Tag);
    }
  }
  return result;
};

const getTagOrCreate = async (tagName: string, business: string): Promise<Tag> => {
  const existingTag = await TagDB.findOne({ name: tagName });
  if (existingTag) {
    return existingTag;
  }

  const tagColor = generateRandomColor();
  return await addTagWithoutAuth(business, {
    business: new Types.ObjectId(business),
    name: tagName,
    color: tagColor,
    altColor: generateAltColor(tagColor)
  });
};

export { getTagsByName, getTagOrCreate };

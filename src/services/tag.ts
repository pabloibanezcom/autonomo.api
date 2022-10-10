import {
  buildPagination,
  generateAltColor,
  GrantType,
  Tag,
  TagFilter,
  TagSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToTagQuery
} from '@autonomo/common';
import mongoose from 'mongoose';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import TagDB from '../models/tag';
import { validateUser } from '../util/user';

export const getCategories = async (businessId: string, searchFilter: TagFilter, populate = ''): Promise<Tag[]> => {
  return await TagDB.find(
    {
      ...transformSearchFilterToTagQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchCategories = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: TagFilter
): Promise<TagSearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await TagDB.count({
    ...transformSearchFilterToTagQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getCategories(businessId, searchFilter)
  };
};

export const addTagWithoutAuth = async (businessId: string, tag: Tag): Promise<Tag> => {
  return await TagDB.create({
    ...tag,
    business: new mongoose.Types.ObjectId(businessId),
    altColor: generateAltColor(tag.color)
  });
};

export const addTag = async (authorizationHeader: string, businessId: string, tag: Tag): Promise<Tag> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await addTagWithoutAuth(businessId, tag);
};

export const updateTag = async (
  authorizationHeader: string,
  businessId: string,
  tagId: string,
  tag: Tag
): Promise<Tag> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingTag = await TagDB.findById(tagId);
  if (!existingTag) {
    throw new NotFoundError();
  }
  if (!businessId.includes(existingTag.business._id.toString())) {
    throw new UnauthorizedError();
  }

  return await TagDB.findByIdAndUpdate(
    tagId,
    { ...tag, altColor: generateAltColor(tag.color) },
    { new: true, runValidators: true }
  );
};

export const deleteTag = async (authorizationHeader: string, businessId: string, tagId: string): Promise<Tag> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingTag = await TagDB.findById(tagId);
  if (!existingTag) {
    throw new NotFoundError();
  }
  if (!businessId.includes(existingTag.business._id.toString())) {
    throw new UnauthorizedError();
  }

  return await TagDB.findByIdAndDelete(tagId);
};

import {
  buildPagination,
  Category,
  CategoryFilter,
  CategorySearchResult,
  generateAltColor,
  GrantType,
  transformPaginationToQueryOptions,
  transformSearchFilterToCategoryQuery
} from '@autonomo/common';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import CategoryDB from '../models/category';
import { validateUser } from '../util/user';

export const getCategories = async (
  businessId: string,
  searchFilter: CategoryFilter,
  populate = ''
): Promise<Category[]> => {
  return await CategoryDB.find(
    {
      ...transformSearchFilterToCategoryQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchCategories = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: CategoryFilter
): Promise<CategorySearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await CategoryDB.count({
    ...transformSearchFilterToCategoryQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getCategories(businessId, searchFilter)
  };
};

export const addCategory = async (
  authorizationHeader: string,
  businessId: string,
  category: Category
): Promise<Category> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await CategoryDB.create({
    ...category,
    business: businessId,
    altColor: generateAltColor(category.color)
  });
};

export const updateCategory = async (
  authorizationHeader: string,
  businessId: string,
  categoryId: string,
  category: Category
): Promise<Category> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingCategory = await CategoryDB.findById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError();
  }
  if (!businessId.includes(existingCategory.business._id.toString())) {
    throw new UnauthorizedError();
  }

  return await CategoryDB.findByIdAndUpdate(
    categoryId,
    { ...category, altColor: generateAltColor(category.color) },
    { new: true, runValidators: true }
  );
};

export const deleteCategory = async (
  authorizationHeader: string,
  businessId: string,
  categoryId: string
): Promise<Category> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingCategory = await CategoryDB.findById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError();
  }
  if (!businessId.includes(existingCategory.business._id.toString())) {
    throw new UnauthorizedError();
  }

  return await CategoryDB.findByIdAndDelete(categoryId);
};

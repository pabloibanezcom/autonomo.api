import {
  buildPagination,
  Category,
  CategoryFilter,
  CategorySearchResult,
  generateAltColor,
  GrantTypes,
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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await CategoryDB.count({
    ...transformSearchFilterToCategoryQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getCategories(businessAndUser.business._id.toString(), searchFilter)
  };
};

export const addCategory = async (
  authorizationHeader: string,
  businessId: string,
  category: Category
): Promise<Category> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CategoryDB.create({
    ...category,
    business: businessAndUser.business._id,
    altColor: generateAltColor(category.color)
  });
};

export const updateCategory = async (
  authorizationHeader: string,
  businessId: string,
  categoryId: string,
  category: Category
): Promise<Category> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingCategory = await CategoryDB.findById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError();
  }
  if (!businessAndUser.business._id.equals(existingCategory.business._id)) {
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
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingCategory = await CategoryDB.findById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError();
  }
  if (!businessAndUser.business._id.equals(existingCategory.business._id)) {
    throw new UnauthorizedError();
  }

  return await CategoryDB.findByIdAndDelete(categoryId);
};

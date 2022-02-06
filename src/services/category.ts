import { Category, GrantTypes } from '@autonomo/common';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import CategoryDB from '../models/category';
import { validateUser } from '../util/user';

export const getCategories = async (authorizationHeader: string, businessId: string): Promise<Category[]> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  return await CategoryDB.find({ business: businessAndUser.business._id });
};

export const addCategory = async (
  authorizationHeader: string,
  businessId: string,
  category: Category
): Promise<Category> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CategoryDB.create({ ...category, business: businessAndUser.business._id });
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

  return await CategoryDB.findByIdAndUpdate(categoryId, category, { new: true, runValidators: true });
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

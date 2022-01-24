import { Category, Invoice } from '@autonomo/common';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import CategoryDB from '../models/category';
import InvoiceDB from '../models/invoice';
import { getUserFromAuthorizationHeader } from '../util/user';

export const getCategoriesByType = async (authorizationHeader: string, categoryType: string): Promise<Category[]> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  return await CategoryDB.find({ user: user._id, type: categoryType });
};

export const addCategory = async (authorizationHeader: string, category: Category): Promise<Category> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  return await CategoryDB.create({ ...category, user: user._id });
};

export const updateCategory = async (
  authorizationHeader: string,
  categoryId: string,
  category: Category
): Promise<Category> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingCategory = await CategoryDB.findById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingCategory.user)) {
    throw new UnauthorizedError();
  }

  return await CategoryDB.findByIdAndUpdate(categoryId, category, { new: true, runValidators: true });
};

export const deleteCategory = async (authorizationHeader: string, categoryId: string): Promise<Category> => {
  const user = await getUserFromAuthorizationHeader(authorizationHeader);
  const existingCategory = await CategoryDB.findById(categoryId);
  if (!existingCategory) {
    throw new NotFoundError();
  }
  if (!user._id.equals(existingCategory.user)) {
    throw new UnauthorizedError();
  }

  await CategoryDB.findByIdAndDelete(categoryId);

  if (existingCategory.type === 'invoice') {
    const categoryInvoices = await InvoiceDB.find({ categories: existingCategory._id });
    await Promise.all(
      categoryInvoices.map(async (invoice): Promise<Invoice> => {
        invoice.categories = invoice.categories.filter(c => c.toString() !== categoryId);
        await invoice.save();
        return invoice;
      })
    );
  }

  return existingCategory;
};

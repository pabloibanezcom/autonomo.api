import {
  buildSearchFilter,
  Expense,
  ExpenseFilter,
  ExpenseSearchResult,
  File,
  GrantTypes,
  transformPaginationToQueryOptions,
  transformSearchFilterToExpenseQuery
} from '@autonomo/common';
import { UploadedFile } from 'express-fileupload';
import { NotFoundError } from '../httpError/httpErrors';
import ExpenseDB from '../models/expense';
import { deleteFile, getFileNameFromKey, uploadFile } from '../util/file';
import { validateUser } from '../util/user';

export const getExpenses = async (
  businessId: string,
  searchFilter: ExpenseFilter,
  populate = ''
): Promise<Expense[]> => {
  return await ExpenseDB.find(
    {
      ...transformSearchFilterToExpenseQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchExpenses = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: ExpenseFilter,
  populate = 'issuer categories'
): Promise<ExpenseSearchResult> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await ExpenseDB.count({
    ...transformSearchFilterToExpenseQuery(searchFilter),
    business: businessId
  });
  const verifiedSearchFilter = buildSearchFilter(searchFilter, totalItems, 'issuedDate');
  return {
    ...verifiedSearchFilter,
    items: await getExpenses(businessAndUser.business._id.toString(), verifiedSearchFilter, populate)
  };
};

export const getExpense = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string,
  populate = 'issuer categories'
): Promise<Expense> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingExpense = await ExpenseDB.findOne({ business: businessAndUser.business._id, _id: expenseId }).populate(
    populate
  );
  if (!existingExpense) {
    throw new NotFoundError();
  }
  return existingExpense;
};

export const addExpense = async (
  authorizationHeader: string,
  businessId: string,
  expense: Expense
): Promise<Expense> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await ExpenseDB.create({ ...expense, business: businessAndUser.business._id });
};

export const updateExpense = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string,
  expense: Expense
): Promise<Expense> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingExpense = await ExpenseDB.findOneAndUpdate(
    { business: businessAndUser.business._id, _id: expenseId },
    expense,
    { new: true, runValidators: true }
  );
  if (!existingExpense) {
    throw new NotFoundError();
  }
  return existingExpense;
};

export const deleteExpense = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string
): Promise<Expense> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingExpense = await ExpenseDB.findOneAndDelete({ business: businessAndUser.business._id, _id: expenseId });
  if (!existingExpense) {
    throw new NotFoundError();
  }
  return existingExpense;
};

export const addExpenseFile = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string,
  file: UploadedFile
): Promise<File> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingExpense = await ExpenseDB.findOne({ business: businessAndUser.business._id, _id: expenseId });
  if (!existingExpense) {
    throw new NotFoundError();
  }

  const existingFileKey = existingExpense.file?.key;

  const uploadedFile = await uploadFile(file, 'expenses');

  existingExpense.file = {
    key: uploadedFile.Key,
    location: uploadedFile.Location
  };

  await existingExpense.save();

  if (existingFileKey && getFileNameFromKey(existingFileKey) !== existingExpense.file.key) {
    await deleteFile(existingFileKey);
  }

  return existingExpense.file;
};

export const deleteExpenseFile = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string
): Promise<Expense> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingExpense = await ExpenseDB.findOne({ business: businessAndUser.business._id, _id: expenseId });
  if (!existingExpense) {
    throw new NotFoundError();
  }

  await deleteFile(existingExpense.file.key);

  existingExpense.file = undefined;

  await existingExpense.save();

  return existingExpense;
};

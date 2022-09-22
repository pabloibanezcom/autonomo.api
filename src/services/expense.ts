import {
  buildSearchFilter,
  Expense,
  ExpenseFilter,
  ExpenseSearchResult,
  File,
  GrantType,
  transformPaginationToQueryOptions,
  transformSearchFilterToExpenseQuery
} from '@autonomo/common';
import { UploadedFile } from 'express-fileupload';
import mongoose from 'mongoose';
import { NotFoundError } from '../httpError/httpErrors';
import ExpenseDB from '../models/expense';
import { deleteFile, getFileNameFromKey, uploadFile } from '../util/file';
import { validateUser } from '../util/user';
import { refreshCompanyStats } from './company';

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
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await ExpenseDB.count({
    ...transformSearchFilterToExpenseQuery(searchFilter),
    business: businessId
  });
  const verifiedSearchFilter = buildSearchFilter(searchFilter, totalItems, 'issuedDate');
  return {
    ...verifiedSearchFilter,
    items: await getExpenses(businessId, verifiedSearchFilter, populate)
  };
};

export const getExpense = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string,
  populate = 'issuer categories'
): Promise<Expense> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const existingExpense = await ExpenseDB.findOne({ business: businessId, _id: expenseId }).populate(populate);
  if (!existingExpense) {
    throw new NotFoundError();
  }
  return existingExpense;
};

export const addExpenseWithoutAuth = async (businessId: string, expense: Expense): Promise<Expense> => {
  const newExpense = await ExpenseDB.create({ ...expense, business: new mongoose.Types.ObjectId(businessId) });
  await refreshCompanyStats(newExpense.issuer._id.toString());
  return newExpense;
};

export const addExpense = async (
  authorizationHeader: string,
  businessId: string,
  expense: Expense
): Promise<Expense> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await addExpenseWithoutAuth(businessId, expense);
};

export const updateExpense = async (
  authorizationHeader: string,
  businessId: string,
  expenseId: string,
  expense: Expense
): Promise<Expense> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingExpense = await ExpenseDB.findOneAndUpdate({ business: businessId, _id: expenseId }, expense, {
    new: true,
    runValidators: true
  });
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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingExpense = await ExpenseDB.findOneAndDelete({ business: businessId, _id: expenseId });
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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingExpense = await ExpenseDB.findOne({ business: businessId, _id: expenseId });
  if (!existingExpense) {
    throw new NotFoundError();
  }

  const existingFileKey = existingExpense.file?.key;

  existingExpense.file = await uploadFile(file, 'expenses');

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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingExpense = await ExpenseDB.findOne({ business: businessId, _id: expenseId });
  if (!existingExpense) {
    throw new NotFoundError();
  }

  await deleteFile(existingExpense.file.key);

  existingExpense.file = undefined;

  await existingExpense.save();

  return existingExpense;
};

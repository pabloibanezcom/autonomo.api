import {
  buildSearchFilter,
  File,
  GrantType,
  Income,
  IncomeFilter,
  IncomeSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToIncomeQuery
} from '@autonomo/common';
import { UploadedFile } from 'express-fileupload';
import { NotFoundError } from '../httpError/httpErrors';
import IncomeDB from '../models/income';
import { deleteFile, getFileNameFromKey, uploadFile } from '../util/file';
import { validateUser } from '../util/user';

export const getIncomes = async (businessId: string, searchFilter: IncomeFilter, populate = ''): Promise<Income[]> => {
  return await IncomeDB.find(
    {
      ...transformSearchFilterToIncomeQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchIncomes = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: IncomeFilter,
  populate = 'client categories'
): Promise<IncomeSearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await IncomeDB.count({
    ...transformSearchFilterToIncomeQuery(searchFilter),
    business: businessId
  });
  const verifiedSearchFilter = buildSearchFilter(searchFilter, totalItems, 'issuedDate');
  return {
    ...verifiedSearchFilter,
    items: await getIncomes(businessId, verifiedSearchFilter, populate)
  };
};

export const getIncome = async (
  authorizationHeader: string,
  businessId: string,
  incomeId: string,
  populate = 'client categories'
): Promise<Income> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const existingIncome = await IncomeDB.findOne({ business: businessId, _id: incomeId }).populate(populate);
  if (!existingIncome) {
    throw new NotFoundError();
  }
  return existingIncome;
};

export const addIncome = async (authorizationHeader: string, businessId: string, income: Income): Promise<Income> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  return await IncomeDB.create({ ...income, business: businessId });
};

export const updateIncome = async (
  authorizationHeader: string,
  businessId: string,
  incomeId: string,
  income: Income
): Promise<Income> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingIncome = await IncomeDB.findOneAndUpdate({ business: businessId, _id: incomeId }, income, {
    new: true,
    runValidators: true
  });
  if (!existingIncome) {
    throw new NotFoundError();
  }
  return existingIncome;
};

export const deleteIncome = async (
  authorizationHeader: string,
  businessId: string,
  incomeId: string
): Promise<Income> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingIncome = await IncomeDB.findOneAndDelete({ business: businessId, _id: incomeId });
  if (!existingIncome) {
    throw new NotFoundError();
  }
  return existingIncome;
};

export const addIncomeFile = async (
  authorizationHeader: string,
  businessId: string,
  incomeId: string,
  file: UploadedFile
): Promise<File> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingIncome = await IncomeDB.findOne({ business: businessId, _id: incomeId });
  if (!existingIncome) {
    throw new NotFoundError();
  }

  const existingFileKey = existingIncome.file?.key;

  const uploadedFile = await uploadFile(file, 'incomes');

  existingIncome.file = {
    key: uploadedFile.Key,
    location: uploadedFile.Location
  };

  await existingIncome.save();

  if (existingFileKey && getFileNameFromKey(existingFileKey) !== existingIncome.file.key) {
    await deleteFile(existingFileKey);
  }

  return existingIncome.file;
};

export const deleteIncomeFile = async (
  authorizationHeader: string,
  businessId: string,
  incomeId: string
): Promise<Income> => {
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingIncome = await IncomeDB.findOne({ business: businessId, _id: incomeId });
  if (!existingIncome) {
    throw new NotFoundError();
  }

  await deleteFile(existingIncome.file.key);

  existingIncome.file = undefined;

  await existingIncome.save();

  return existingIncome;
};

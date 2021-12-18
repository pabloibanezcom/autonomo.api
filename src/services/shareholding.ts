import { Shareholding } from '@autonomo/common';
import { SHAREHOLDING_ALREADY_EXISTS, SHAREHOLDING_COMPANY_OR_PERSON_DONT_EXIST } from '../httpError/errorMessages';
import ShareholdingDB from '../models/shareholding';
import { checkCompany, checkPerson } from '../util/checkIfExist';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShareholdingsByCompany = async (companyId: string): Promise<Shareholding[]> => {
  return await ShareholdingDB.find({});
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getShareholdingsByShareholder = async (personId: string): Promise<Shareholding[]> => {
  return await ShareholdingDB.find({});
};

export const getShareholding = async (shareholdingId: string): Promise<Shareholding> => {
  return await ShareholdingDB.findById(shareholdingId);
};

export const addShareholding = async (shareholding: Shareholding): Promise<Shareholding> => {
  // Check if exists shareholding for same company and person
  const existingShareholding = await ShareholdingDB.find({
    company: shareholding.company,
    shareholder: shareholding.shareholder
  });
  if (existingShareholding) {
    throw new Error(SHAREHOLDING_ALREADY_EXISTS);
  }
  // Check if company and shareholder exist
  if (
    (await !checkCompany(shareholding.company as unknown as string)) ||
    (await !checkPerson(shareholding.shareholder as unknown as string))
  ) {
    throw new Error(SHAREHOLDING_COMPANY_OR_PERSON_DONT_EXIST);
  }

  return await ShareholdingDB.create(shareholding);
};

export const updateShareholding = async (shareholdingId: string, shareholding: Shareholding): Promise<Shareholding> => {
  return await ShareholdingDB.findByIdAndUpdate(shareholdingId, shareholding, { new: true, runValidators: true });
};

export const deleteShareholding = async (shareholdingId: string): Promise<Shareholding> => {
  return await ShareholdingDB.findByIdAndDelete(shareholdingId);
};

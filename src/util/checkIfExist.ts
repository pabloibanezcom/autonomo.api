import CompanyDB from '../models/company';
import PersonDB from '../models/person';

export const checkCompany = async (companyId: string): Promise<boolean> => {
  const doc = await CompanyDB.findById(companyId);
  return !!doc;
};

export const checkPerson = async (personId: string): Promise<boolean> => {
  const doc = await PersonDB.findById(personId);
  return !!doc;
};

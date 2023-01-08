import CompanyModel from '../models/company';
import PersonModel from '../models/person';

export const checkCompany = async (companyId: string): Promise<boolean> => {
  const doc = await CompanyModel.findById(companyId);
  return !!doc;
};

export const checkPerson = async (personId: string): Promise<boolean> => {
  const doc = await PersonModel.findById(personId);
  return !!doc;
};

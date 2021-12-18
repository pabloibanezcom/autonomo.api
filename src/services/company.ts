import { Company } from '@autonomo/common';
import CompanyDB from '../models/company';

export const getCompanies = async (): Promise<Company[]> => {
  return await CompanyDB.find({});
};

export const getCompany = async (companyId: string): Promise<Company> => {
  return await CompanyDB.findById(companyId);
};

export const addCompany = async (company: Company): Promise<Company> => {
  return await CompanyDB.create(company);
};

export const updateCompany = async (companyId: string, company: Company): Promise<Company> => {
  return await CompanyDB.findByIdAndUpdate(companyId, company, { new: true, runValidators: true });
};

export const deleteCompany = async (companyId: string): Promise<Company> => {
  return await CompanyDB.findByIdAndDelete(companyId);
};

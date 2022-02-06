import { Company, GrantTypes } from '@autonomo/common';
import CompanyDB from '../models/company';
import { validateUser } from '../util/user';

export const getCompanies = async (authorizationHeader: string, businessId: string): Promise<Company[]> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  return await CompanyDB.find({ business: businessAndUser.business._id }).populate('director');
};

export const getCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  return await CompanyDB.findOne({ business: businessAndUser.business._id, _id: companyId }).populate('director');
};

export const addCompany = async (
  authorizationHeader: string,
  businessId: string,
  company: Company
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CompanyDB.create({ ...company, business: businessAndUser.business._id });
};

export const updateCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string,
  company: Company
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CompanyDB.findOneAndUpdate({ business: businessAndUser.business._id, _id: companyId }, company, {
    new: true,
    runValidators: true
  });
};

export const deleteCompany = async (
  authorizationHeader: string,
  businessId: string,
  companyId: string
): Promise<Company> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await CompanyDB.findOneAndDelete({ business: businessAndUser.business._id, _id: companyId });
};

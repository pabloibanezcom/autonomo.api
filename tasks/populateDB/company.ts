/* eslint-disable @typescript-eslint/no-explicit-any */
import { Company, Currency, generateRandomColor } from '@autonomo/common';
import { Types } from 'mongoose';
import CompanyDB from '../../src/models/company';
import { getBusinessByName } from './business';
import { log } from './log';
import { getPersonByEmail } from './person';

type MockCompany = {
  name: string;
  country: string;
  cifVat?: string;
  director: string;
  address?: {
    line1: string;
    line2: string;
    postalCode: string;
    town: string;
    country: string;
  };
  defaultCurrency: string;
  creationDate?: string;
};

type BusinessCompanies = {
  business: string;
  companies: MockCompany[];
};

const getCompanyByName = async (companyName: string, business: string): Promise<Company> => {
  return (await CompanyDB.findOne({ name: companyName, business })) as Company;
};

const generateCompanies = async (companies: any[]): Promise<void> => {
  const generateCompaniesForBusiness = async (businessCompanies: BusinessCompanies) => {
    const business = await getBusinessByName(businessCompanies.business);
    const newCompanies = await Promise.all(
      businessCompanies.companies.map(async (company): Promise<Company> => {
        const c = await CompanyDB.create({
          ...company,
          business: business?._id,
          creationDate: company.creationDate ? new Date(company.creationDate) : undefined,
          defaultCurrency: company.defaultCurrency as Currency,
          director: await getPersonByEmail(company.director),
          color: generateRandomColor()
        });
        return c;
      })
    );

    log('Companies generated', newCompanies.length, business.name);
  };

  for (const businessCompanies of companies) {
    await generateCompaniesForBusiness(businessCompanies);
  }
};

const getCompanyOrCreate = async (companyName: string, business: string): Promise<Company> => {
  const existingCompany = await getCompanyByName(companyName, business);
  if (existingCompany) {
    return existingCompany;
  }
  return await CompanyDB.create({
    business: new Types.ObjectId(business),
    name: companyName,
    color: generateRandomColor()
  });
};

export { getCompanyByName, generateCompanies, getCompanyOrCreate };

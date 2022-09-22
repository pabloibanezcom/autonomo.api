/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Company, Currency, File, generateRandomColor } from '@autonomo/common';
import { Types } from 'mongoose';
import CompanyDB from '../../src/models/company';
import { addCompanyWithoutAuth } from '../../src/services/company';
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

const generateCompanies = async (companies: any[]): Promise<any[]> => {
  const imageFiles: any[] = [];

  const generateCompaniesForBusiness = async (businessCompanies: BusinessCompanies) => {
    const business = await getBusinessByName(businessCompanies.business);
    const newCompanies = await Promise.all(
      businessCompanies.companies.map(async (company): Promise<Company> => {
        const c = await addCompanyWithoutAuth(business._id?.toString() as string, {
          ...company,
          business: business?._id as Types.ObjectId,
          creationDate: company.creationDate ? new Date(company.creationDate) : undefined,
          defaultCurrency: company.defaultCurrency as Currency,
          director: await getPersonByEmail(company.director),
          color: generateRandomColor(),
          logoFile: imageFiles.find(file => file.companyName === company.name)?.file
        });
        return c;
      })
    );

    log('Companies generated', newCompanies.length, business.name);
  };

  for (const businessCompanies of companies) {
    await generateCompaniesForBusiness(businessCompanies);
  }

  return imageFiles;
};

const getCompanyOrCreate = async (companyName: string, business: string, logoFile?: File): Promise<Company> => {
  const existingCompany = await getCompanyByName(companyName, business);
  if (existingCompany) {
    return existingCompany;
  }
  return await addCompanyWithoutAuth(business, {
    business: new Types.ObjectId(business),
    name: companyName,
    color: generateRandomColor(),
    logoFile
  });
};

export { getCompanyByName, generateCompanies, getCompanyOrCreate };

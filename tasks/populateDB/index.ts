import dotenv from 'dotenv';
import connect from '../../src/connect';
import {
  BusinessDB,
  CategoryDB,
  CompanyDB,
  ExpenseDB,
  IncomeDB,
  NationalInsurancePaymentDB,
  PersonDB,
  TaxPaymentDB,
  TaxYearDB,
  UserDB
} from '../../src/models';
import { logStatus } from './log';

import { generateBusiness, setBusinessCompany, setBusinessData } from './business';
import { generateCategories } from './category';
import { generateCompanies } from './company';
import { generateExpenses } from './expense';
import { uploadFiles } from './files';
import { generateIncomes } from './income';
import { generateNationalInsurancePayments } from './nationalInsurancePayment';
import { generatePeople } from './person';
import { generateTaxPayments } from './taxPayment';
import { generateTaxYears } from './taxYear';
import { generateUsers } from './users';

import { getGoogleDriveData } from './googleDrive';

const generateDB = async (): Promise<void> => {
  logStatus('DB Populate job started');

  const clearExistingData = async (): Promise<void> => {
    await TaxPaymentDB.deleteMany({});
    await NationalInsurancePaymentDB.deleteMany({});
    await ExpenseDB.deleteMany({});
    await IncomeDB.deleteMany({});
    await CategoryDB.deleteMany({});
    await PersonDB.deleteMany({});
    await CompanyDB.deleteMany({});
    await TaxYearDB.deleteMany({});
    await BusinessDB.deleteMany({});
    await UserDB.deleteMany({});
  };

  const googleDriveData = await getGoogleDriveData(process.env.POPULATE_FILES === 'true');
  const uploadedFiles = await uploadFiles(googleDriveData.files);

  await connect({ db: process.env.MONGODB_URI || '' });
  await clearExistingData();

  await generatePeople(googleDriveData.data.people.data);
  await generateUsers(googleDriveData.data.users.data);
  await generateBusiness(googleDriveData.data.businesses.data);
  await generateTaxYears(googleDriveData.data['tax_years'].data);
  await generateCompanies(googleDriveData.data.companies.data);
  await setBusinessCompany(googleDriveData.data.businesses.data);
  await generateCategories(googleDriveData.data.categories.data);

  await setBusinessData(googleDriveData.businessesData);

  await generateExpenses(googleDriveData.businessesData, uploadedFiles);
  await generateIncomes(googleDriveData.businessesData, googleDriveData.data['incomes_services'].data, uploadedFiles);
  await generateNationalInsurancePayments(googleDriveData.businessesData);
  await generateTaxPayments(googleDriveData.businessesData);
  logStatus('DB Populate job completed');
  process.exit();
};

dotenv.config();
generateDB();

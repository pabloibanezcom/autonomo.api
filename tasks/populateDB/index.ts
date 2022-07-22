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

import { generateBusiness, replaceBusinessNameById, setBusinessCompany } from './business';
import { generateCategories } from './category';
import { generateCompanies } from './company';
import { generateExpenses } from './expense';
import { generateIncomes } from './income';
import { generateNationalInsurancePayments } from './nationalInsurancePayment';
import { generatePeople } from './person';
import { generateTaxPayments } from './taxPayment';
import { generateTaxYears } from './taxYear';

import { getDataFromDriveFiles } from './googleDrive';
import readXlsxData from './readXlsxData';

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

    const users = await UserDB.find({});
    for (const user of users) {
      user.defaultBusiness = undefined;
      user.businesses = [];
      await user.save();
    }
  };

  const driveMockData = await getDataFromDriveFiles();

  await connect({ db: process.env.MONGODB_URI || '' });
  await clearExistingData();
  await generatePeople(driveMockData.people);
  await generateBusiness(driveMockData.businesses);
  await generateTaxYears(driveMockData['tax_years']);
  await generateCompanies(driveMockData.companies);
  await setBusinessCompany(driveMockData.businesses);
  await generateCategories(driveMockData.categories);

  const xlsxData = await replaceBusinessNameById(await readXlsxData());
  await generateIncomes(xlsxData, driveMockData['incomes_services']);
  await generateExpenses(xlsxData);
  await generateNationalInsurancePayments(xlsxData);
  await generateTaxPayments(xlsxData);
  logStatus('DB Populate job completed');
  process.exit();
};

dotenv.config();
generateDB();

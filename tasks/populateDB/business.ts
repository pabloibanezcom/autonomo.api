/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Business,
  BusinessPerson,
  BusinessRole,
  BusinessType,
  Currency,
  ExchangeRate,
  GrantType,
  Person
} from '@autonomo/common';
import { Types } from 'mongoose';
import BusinessDB from '../../src/models/business';
import PersonDB from '../../src/models/person';
import UserDB from '../../src/models/user';
import { getCompanyByName } from './company';
import { log } from './log';

type MockExchangeRate = {
  currencyFrom: string;
  currencyTo: string;
  rate: number;
};

const getBusinessByName = async (businessName: string): Promise<Business> => {
  return (await BusinessDB.findOne({ name: businessName })) as Business;
};

const replaceBusinessNameById = async (arr: any[]): Promise<any[]> => {
  return await Promise.all(
    arr.map(async item => {
      return {
        ...item,
        business: await getBusinessByName(item.business)
      };
    })
  );
};

const generateBusiness = async (businesses: any[]): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformBusinessPerson = async (people: any[]): Promise<BusinessPerson[]> => {
    const result: BusinessPerson[] = [];
    for (const p of people) {
      const person = await PersonDB.findOne({ email: p.email });
      result.push({
        ...p,
        person: person?.id
      });
    }

    return result;
  };

  const transformExchangeRates = (exhangeRates: MockExchangeRate[]): ExchangeRate[] => {
    return exhangeRates?.map(exRate => {
      return { ...exRate, currencyFrom: exRate.currencyFrom as Currency, currencyTo: exRate.currencyTo as Currency };
    });
  };

  const getSoleTrader = async (soleTraderEmail: string): Promise<Person | undefined> => {
    if (soleTraderEmail) {
      return (await PersonDB.findOne({ email: soleTraderEmail })) as Person;
    }
    return undefined;
  };

  const addBusinessToUser = async (email: string, role: string, businessId: Types.ObjectId, isDefault: boolean) => {
    const user = await UserDB.findOne({ email });
    if (user) {
      user.businesses?.push({
        business: businessId,
        role: role as BusinessRole,
        grantType: role === BusinessRole.Director || role === BusinessRole.SoleTrader ? GrantType.Write : GrantType.View
      });
      user.defaultBusiness = isDefault ? businessId : undefined;
      await user.save();
    }
  };

  const createNewBusiness = async (bussinessObj: any): Promise<Business> => {
    const businessPeople = await transformBusinessPerson(bussinessObj.people);
    const soleTrader = await getSoleTrader(bussinessObj.soleTrader);

    return {
      name: bussinessObj.name,
      type: bussinessObj.type as BusinessType,
      country: bussinessObj.country,
      defaultCurrency: bussinessObj.defaultCurrency as Currency,
      exchangeRates: transformExchangeRates(bussinessObj.exchangeRates),
      company: undefined,
      soleTrader: soleTrader ? soleTrader._id : undefined,
      tradingStartDate: bussinessObj.tradingStartDate ? new Date(bussinessObj.tradingStartDate) : undefined,
      people: businessPeople,
      nextInvoiceNumber: bussinessObj.nextInvoiceNumber,
      natureOfBusiness: bussinessObj.natureOfBusiness
    } as Business;
  };

  const newBusinesses = await Promise.all(
    businesses.map(async (b): Promise<Business> => {
      const newBusiness = await BusinessDB.create(await createNewBusiness(b));

      for (const bP of b.people) {
        await addBusinessToUser(bP.email, bP.role, newBusiness.id, b.isDefault);
      }

      return newBusiness;
    })
  );
  log('Business generated', newBusinesses.length);
};

const setBusinessCompany = async (businesses: any[]): Promise<void> => {
  for (const business of businesses) {
    if (business.type === 'company') {
      const businessToUpdate = await await BusinessDB.findOne({ name: business.name });
      if (!businessToUpdate) {
        return;
      }
      const businessCompany = await getCompanyByName(business.name, businessToUpdate.id);

      businessToUpdate.company = businessCompany._id;
      await businessToUpdate.save();
      log('Business company updated', business.name);
    }
  }
};

export { getBusinessByName, replaceBusinessNameById, generateBusiness, setBusinessCompany };

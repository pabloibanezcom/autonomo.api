import * as mockingoose from 'mockingoose';
import CompanyModel from '../models/company';
import PersonModel from '../models/person';

import { checkCompany, checkPerson } from './checkIfExist';

describe('checkIfExist', () => {
  describe('checkCompany', () => {
    test('returns true if company exists DB', async () => {
      mockingoose(CompanyModel).toReturn(
        {
          name: 'CompanyA'
        },
        'findOne'
      );
      const result = await checkCompany('1111-2222');
      expect(result).toBe(true);
    });

    test('returns false if company does not exists in DB', async () => {
      mockingoose(CompanyModel).toReturn(undefined, 'findOne');
      const result = await checkCompany('1111-2222');
      expect(result).toBe(false);
    });
  });

  describe('checkPerson', () => {
    test('returns true if person exists DB', async () => {
      mockingoose(PersonModel).toReturn(
        {
          name: 'PersonA'
        },
        'findOne'
      );
      const result = await checkPerson('1111-2222');
      expect(result).toBe(true);
    });

    test('returns false if person does not exists in DB', async () => {
      mockingoose(PersonModel).toReturn(undefined, 'findOne');
      const result = await checkPerson('1111-2222');
      expect(result).toBe(false);
    });
  });
});

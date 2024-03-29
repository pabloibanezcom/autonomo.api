import { Person } from '@autonomo/common';
import people from '../../..//mockData/people.json';
import PersonDB from '../../src/models/person';

export const generatePerson = async (): Promise<Person> => {
  return await PersonDB.create(people[0]);
};

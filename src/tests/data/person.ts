import { Person } from '@autonomo/common';
import PersonDB from '../../models/person';
import people from './mockData/people.json';

export const generatePerson = async (): Promise<Person> => {
  return await PersonDB.create(people[0]);
};

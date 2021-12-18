import { Person } from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import PersonDB from '../models/person';

export const getPeople = async (): Promise<Person[]> => {
  return await PersonDB.find({});
};

export const getPerson = async (personId: string): Promise<Person> => {
  const person = await PersonDB.findById(personId);
  if (!person) {
    throw new NotFoundError();
  }
  return person;
};

export const addPerson = async (person: Person): Promise<Person> => {
  return await PersonDB.create(person);
};

export const updatePerson = async (personId: string, person: Person): Promise<Person> => {
  return await PersonDB.findByIdAndUpdate(personId, person, { new: true, runValidators: true });
};

export const deletePerson = async (personId: string): Promise<Person> => {
  return await PersonDB.findByIdAndDelete(personId);
};

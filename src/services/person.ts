import { GrantTypes, Person } from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import PersonDB from '../models/person';
import { validateUser } from '../util/user';

export const getPeople = async (authorizationHeader: string, businessId: string): Promise<Person[]> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  return await PersonDB.find({ business: businessAndUser.business._id });
};

export const getPerson = async (authorizationHeader: string, businessId: string, personId: string): Promise<Person> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingPerson = await PersonDB.findOne({
    business: businessAndUser.business._id,
    _id: personId
  });
  if (!existingPerson) {
    throw new NotFoundError();
  }
  return existingPerson;
};

export const addPerson = async (authorizationHeader: string, businessId: string, person: Person): Promise<Person> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await PersonDB.create({ ...person, business: businessAndUser.business._id });
};

export const updatePerson = async (
  authorizationHeader: string,
  businessId: string,
  personId: string,
  person: Person
): Promise<Person> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPerson = await PersonDB.findOneAndUpdate(
    { business: businessAndUser.business._id, _id: personId },
    person,
    { new: true, runValidators: true }
  );
  if (!existingPerson) {
    throw new NotFoundError();
  }
  return existingPerson;
};

export const deletePerson = async (
  authorizationHeader: string,
  businessId: string,
  personId: string
): Promise<Person> => {
  const businessAndUser = await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPerson = await PersonDB.findOneAndDelete({
    business: businessAndUser.business._id,
    _id: personId
  });
  if (!existingPerson) {
    throw new NotFoundError();
  }
  return existingPerson;
};

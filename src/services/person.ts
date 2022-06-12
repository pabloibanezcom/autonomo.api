import {
  buildPagination,
  generateRandomColor,
  GrantTypes,
  Person,
  PersonFilter,
  PersonSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToPersonQuery
} from '@autonomo/common';
import { NotFoundError } from '../httpError/httpErrors';
import PersonDB from '../models/person';
import { validateUser } from '../util/user';

export const getPeople = async (businessId: string, searchFilter: PersonFilter, populate = ''): Promise<Person[]> => {
  return await PersonDB.find(
    {
      ...transformSearchFilterToPersonQuery(searchFilter),
      business: businessId
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchPeople = async (
  authorizationHeader: string,
  businessId: string,
  searchFilter: PersonFilter
): Promise<PersonSearchResult> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const totalItems = await PersonDB.count({
    ...transformSearchFilterToPersonQuery(searchFilter),
    business: businessId
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getPeople(businessId, searchFilter)
  };
};

export const getPerson = async (authorizationHeader: string, businessId: string, personId: string): Promise<Person> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.View);
  const existingPerson = await PersonDB.findOne({
    business: businessId,
    _id: personId
  });
  if (!existingPerson) {
    throw new NotFoundError();
  }
  return existingPerson;
};

export const addPerson = async (authorizationHeader: string, businessId: string, person: Person): Promise<Person> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  return await PersonDB.create({
    ...person,
    business: businessId,
    color: person.color || generateRandomColor()
  });
};

export const updatePerson = async (
  authorizationHeader: string,
  businessId: string,
  personId: string,
  person: Person
): Promise<Person> => {
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPerson = await PersonDB.findOneAndUpdate({ business: businessId, _id: personId }, person, {
    new: true,
    runValidators: true
  });
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
  await validateUser(authorizationHeader, businessId, GrantTypes.Write);
  const existingPerson = await PersonDB.findOneAndDelete({
    business: businessId,
    _id: personId
  });
  if (!existingPerson) {
    throw new NotFoundError();
  }
  return existingPerson;
};

import {
  buildPagination,
  generateRandomColor,
  GrantType,
  Person,
  PersonFilter,
  PersonSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToPersonQuery
} from '@autonomo/common';
import { BadRequestError, NotFoundError } from '../httpError/httpErrors';
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
  if (!searchFilter || !Object.keys(searchFilter).length) {
    throw new BadRequestError('searchFilter can not be empty');
  }
  await validateUser(authorizationHeader, businessId, GrantType.View);
  const totalItems = await PersonDB.count({
    ...transformSearchFilterToPersonQuery(searchFilter),
    business: businessId
  });
  return {
    ...{ ...searchFilter, pagination: buildPagination(searchFilter.pagination, totalItems) },
    ...{ items: await getPeople(businessId, searchFilter) }
  };
};

export const getPerson = async (authorizationHeader: string, businessId: string, personId: string): Promise<Person> => {
  await validateUser(authorizationHeader, businessId, GrantType.View);
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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
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
  await validateUser(authorizationHeader, businessId, GrantType.Write);
  const existingPerson = await PersonDB.findOneAndDelete({
    business: businessId,
    _id: personId
  });
  if (!existingPerson) {
    throw new NotFoundError();
  }
  return existingPerson;
};

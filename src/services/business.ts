import {
  buildPagination,
  Business,
  BusinessFilter,
  BusinessSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToBusinessQuery
} from '@autonomo/common';
import BusinessDB from '../models/business';

import { basicCompany, basicPerson } from '../mongoose/populate';
import { validateUser } from '../util/user';

const defaultPopulate = [
  { path: 'company', populate: basicCompany },
  { path: 'people.person', select: basicPerson },
  { path: 'soleTrader', select: basicPerson }
];

export const getBusinesses = async (
  userId: string,
  searchFilter: BusinessFilter,
  populate = defaultPopulate
): Promise<Business[]> => {
  return await BusinessDB.find(
    {
      ...transformSearchFilterToBusinessQuery(searchFilter),
      authorisedPeople: { $elemMatch: { user: userId } }
    },
    null,
    transformPaginationToQueryOptions(searchFilter.pagination, searchFilter.sorting)
  ).populate(populate);
};

export const searchBusinesses = async (
  authorizationHeader: string,
  searchFilter: BusinessFilter
): Promise<BusinessSearchResult> => {
  const user = await validateUser(authorizationHeader);
  const totalItems = await BusinessDB.count({
    ...transformSearchFilterToBusinessQuery(searchFilter),
    authorisedPeople: { $elemMatch: { user: user._id } }
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getBusinesses(user._id.toString(), searchFilter)
  };
};

export const getBusiness = async (authorizationHeader: string, businessId: string): Promise<Business> => {
  const user = await validateUser(authorizationHeader);
  return await BusinessDB.findOne({
    _id: businessId,
    authorisedPeople: { $elemMatch: { user: user._id } }
  }).populate(defaultPopulate);
};

export const addBusiness = async (authorizationHeader: string, business: Business): Promise<Business> => {
  const user = await validateUser(authorizationHeader);
  return await BusinessDB.create({
    ...business,
    authorisedPeople: [{ user: user._id, grantType: 'Write' }]
  });
};

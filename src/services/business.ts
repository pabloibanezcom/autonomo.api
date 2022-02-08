import {
  buildPagination,
  Business,
  BusinessFilter,
  BusinessSearchResult,
  transformPaginationToQueryOptions,
  transformSearchFilterToBusinessQuery
} from '@autonomo/common';
import BusinessDB from '../models/business';
import { validateUser } from '../util/user';

export const getBusinesses = async (
  userId: string,
  searchFilter: BusinessFilter,
  populate = ''
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
  const businessAndUser = await validateUser(authorizationHeader);
  const totalItems = await BusinessDB.count({
    ...transformSearchFilterToBusinessQuery(searchFilter),
    authorisedPeople: { $elemMatch: { user: businessAndUser.user._id } }
  });
  return {
    pagination: buildPagination(searchFilter.pagination, totalItems),
    sorting: searchFilter.sorting,
    items: await getBusinesses(businessAndUser.user._id.toString(), searchFilter)
  };
};

export const getBusiness = async (authorizationHeader: string, businessId: string): Promise<Business> => {
  const businessAndUser = await validateUser(authorizationHeader);
  return await BusinessDB.findOne({
    _id: businessId,
    authorisedPeople: { $elemMatch: { user: businessAndUser.user._id } }
  });
};

export const addBusiness = async (authorizationHeader: string, business: Business): Promise<Business> => {
  const businessAndUser = await validateUser(authorizationHeader);
  return await BusinessDB.create({
    ...business,
    authorisedPeople: [{ user: businessAndUser.user._id, grantType: 'Write' }]
  });
};

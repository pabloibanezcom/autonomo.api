import { Business } from '@autonomo/common';
import BusinessDB from '../models/business';
import { validateUser } from '../util/user';

export const getBusinesses = async (authorizationHeader: string): Promise<Business[]> => {
  const businessAndUser = await validateUser(authorizationHeader);
  return await BusinessDB.find({ authorisedPeople: { $elemMatch: { user: businessAndUser.user._id } } });
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

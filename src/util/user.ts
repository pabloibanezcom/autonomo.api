import { Business, GrantTypes, User } from '@autonomo/common';
import { Bool } from 'aws-sdk/clients/clouddirectory';
import { auth0Client } from '../httpClient';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import { BusinessAndUser } from '../interfaces/BusinessAndUser';
import BusinessDB from '../models/business';
import UserDB from '../models/user';

const validateGrantType = (required: GrantTypes, current: GrantTypes): Bool => {
  if (required > current) {
    throw new UnauthorizedError();
  }
  return true;
};

export const validateUser = async (
  authorizationHeader: string,
  businessId?: string,
  granType?: GrantTypes
): Promise<BusinessAndUser> => {
  let business: Business;
  if (businessId) {
    business = await BusinessDB.findById(businessId);
    if (!business) {
      throw new NotFoundError();
    }
  }
  const response = await auth0Client(authorizationHeader).get('/userinfo');
  const user = await UserDB.findOne({ auth0UserId: response?.data?.sub });
  if (!user) {
    throw new UnauthorizedError();
  }
  if (granType) {
    validateGrantType(
      granType,
      user.isAdmin
        ? GrantTypes.Admin
        : business?.authorisedPeople.find(authPeople => authPeople.user.equals(user.id)).grantType
    );
  }
  return {
    business,
    user
  };
};

export const getUserOrCreateIt = async (authorizationHeader: string): Promise<User> => {
  const response = await auth0Client(authorizationHeader).get('/userinfo');
  if (!response?.data) {
    throw new UnauthorizedError();
  }
  let user = await UserDB.findOne({ auth0UserId: response.data.sub });
  if (!user) {
    user = await UserDB.create({
      auth0UserId: response.data.sub,
      firstName: response.data.given_name,
      lastName: response.data.family_name,
      email: response.data.email,
      picture: response.data.picture
    });
  }
  return user;
};

import { Business, GrantTypes, LoginResponse, User } from '@autonomo/common';
import { Bool } from 'aws-sdk/clients/clouddirectory';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passwordValidator from 'password-validator';
import { NotFoundError, UnauthorizedError } from '../httpError/httpErrors';
import { BusinessAndUser } from '../interfaces/BusinessAndUser';
import JWTUser from '../interfaces/JWTUser';
import BusinessDB from '../models/business';
import UserDB from '../models/user';

const validateGrantType = (required: GrantTypes, current: GrantTypes): Bool => {
  if (required > current) {
    throw new UnauthorizedError();
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validatePassword = (password: string): boolean | any[] => {
  const schema = new passwordValidator();
  schema.is().min(8).is().max(20).has().uppercase().has().lowercase().has().not().spaces();
  return schema.validate(password, { details: true });
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validateUserPassword = async (password: string, userPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, userPassword);
};

export const generateLoginResponse = (user: User): LoginResponse => {
  return {
    access_token: jwt.sign({ email: user.email, id: user._id }, process.env.JWT_TOKEN_SECRET),
    expires_in: 86400,
    token_type: 'Bearer'
  };
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
  if (!authorizationHeader) {
    throw new UnauthorizedError();
  }
  const jwtUser = jwt.verify(authorizationHeader.replace('Bearer ', ''), process.env.JWT_TOKEN_SECRET) as JWTUser;
  const user = await UserDB.findById(jwtUser.id).select('-password');
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

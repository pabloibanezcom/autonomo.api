import {
  ChangePasswordData,
  generateRandomColor,
  LoginData,
  LoginResponse,
  RegisterData,
  User
} from '@autonomo/common';
import { BadRequestError, UnauthorizedError, UserAlreadyExistsError } from '../httpError/httpErrors';
import UserDB from '../models/user';
import {
  generateLoginResponse,
  hashPassword,
  validatePassword,
  validateUser,
  validateUserPassword
} from '../util/user';

export const login = async (loginData: LoginData): Promise<LoginResponse> => {
  const user = await UserDB.findOne({ email: loginData.email.toLowerCase() });
  if (!user) {
    throw new UnauthorizedError();
  }
  const isValidPassword = await validateUserPassword(loginData.password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }

  return generateLoginResponse(user);
};

export const registerUser = async (registerData: RegisterData): Promise<boolean> => {
  const existingUser = await UserDB.findOne({ email: registerData.email.toLowerCase() });
  if (existingUser) {
    throw new UserAlreadyExistsError();
  }
  const passwordValidation = validatePassword(registerData.password);
  if (Array.isArray(passwordValidation) && passwordValidation.length) {
    throw new BadRequestError(passwordValidation.map(e => e.message).join(' | '));
  }
  await UserDB.create({
    ...registerData,
    email: registerData.email.toLowerCase(),
    password: await hashPassword(registerData.password),
    color: generateRandomColor()
  });
  return true;
};

export const changePassword = async (changePasswordData: ChangePasswordData): Promise<boolean> => {
  const user = await UserDB.findOne({ email: changePasswordData.email.toLowerCase() });
  if (!user) {
    throw new UnauthorizedError();
  }
  const isValidPassword = await validateUserPassword(changePasswordData.password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError();
  }
  const passwordValidation = validatePassword(changePasswordData.newPassword);
  if (Array.isArray(passwordValidation) && passwordValidation.length) {
    throw new BadRequestError(passwordValidation.map(e => e.message).join(' | '));
  }
  user.password = await hashPassword(changePasswordData.newPassword);
  await user.save();
  return true;
};

export const getUser = async (authorizationHeader: string): Promise<User> => {
  return await validateUser(authorizationHeader, null, null, true);
};

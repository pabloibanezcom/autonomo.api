import { BusinessRole, GrantType } from '@autonomo/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as mockingoose from 'mockingoose';
import { mockUser, mockUserBusiness } from '../../tests/util/mockData';
import { UnauthorizedError } from '../httpError/httpErrors';
import UserModel from '../models/user';
import { generateLoginResponse, hashPassword, validatePassword, validateUser, validateUserPassword } from './user';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('user', () => {
  describe('validatePassword', () => {
    test('returns empty array when password is valid', () => {
      expect(validatePassword('Aa12345678')).toStrictEqual([]);
    });

    test('returns error obj when password is not valid', () => {
      const nonLowerCaseValidation = validatePassword('A12345678');
      expect(nonLowerCaseValidation).toHaveLength(1);
      expect(nonLowerCaseValidation[0].validation).toBe('lowercase');

      const nonUpperCaseValidation = validatePassword('a12345678');
      expect(nonUpperCaseValidation).toHaveLength(1);
      expect(nonUpperCaseValidation[0].validation).toBe('uppercase');

      const lessThanEightValidation = validatePassword('Aa12');
      expect(lessThanEightValidation).toHaveLength(1);
      expect(lessThanEightValidation[0].validation).toBe('min');

      const moreThanTwentyValidation = validatePassword('Aa12345678Aa1234567834434');
      expect(moreThanTwentyValidation).toHaveLength(1);
      expect(moreThanTwentyValidation[0].validation).toBe('max');

      const spacesValidation = validatePassword('Aa1234567 8');
      expect(spacesValidation).toHaveLength(1);
      expect(spacesValidation[0].validation).toBe('spaces');

      const everythingWrongValidation = validatePassword('127 8');
      expect(everythingWrongValidation).toHaveLength(4);
    });
  });

  describe('hashPassword', () => {
    const genSalt = bcrypt.genSalt as jest.Mock;
    const hash = bcrypt.hash as jest.Mock;

    beforeEach(() => {
      genSalt.mockReset();
      genSalt.mockResolvedValue('mockedGenSalt');

      hash.mockReset();
      hash.mockResolvedValue('mockedHashedPassword');
    });

    test('returns password hash', async () => {
      await hashPassword('Aa12345678');
      expect(genSalt).toHaveBeenCalledTimes(1);
      expect(hash).toHaveBeenCalledTimes(1);
      expect(hash).toHaveBeenCalledWith('Aa12345678', 'mockedGenSalt');
    });
  });

  describe('validateUserPassword', () => {
    const compare = bcrypt.compare as jest.Mock;

    beforeEach(() => {
      compare.mockReset();
    });

    test('invokes bcrypt.compare with both passwords and return its result', async () => {
      compare.mockResolvedValue(true);
      const result = await validateUserPassword('1234', '1256');
      expect(compare).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);

      compare.mockResolvedValue(false);
      const result2 = await validateUserPassword('1234', '1256');
      expect(compare).toHaveBeenCalledTimes(2);
      expect(result2).toBe(false);
    });
  });

  describe('generateLoginResponse', () => {
    const sign = jwt.sign as jest.Mock;

    beforeEach(() => {
      sign.mockReset();
    });

    const user = mockUser({ email: 'mockuser@google.com' });
    test('returns login response from a user', () => {
      sign.mockResolvedValue('mockedAccessToken');
      generateLoginResponse(user);
      expect(sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateUser', () => {
    const verify = jwt.verify as jest.Mock;

    beforeEach(() => {
      verify.mockReset();
    });

    test('returns UnauthorizedError if authorizationHeader is null', async () => {
      await expect(validateUser(null)).rejects.toThrow(UnauthorizedError);
    });

    test('returns UnauthorizedError if user is not found from token', async () => {
      mockingoose(UserModel).toReturn(undefined, 'findOne');
      verify.mockResolvedValue({ id: '1111111' });
      await expect(validateUser('1111111111')).rejects.toThrow(UnauthorizedError);
    });

    describe('returns user', () => {
      const mockedUserBusiness = mockUserBusiness({
        business: '123456789012',
        grantType: GrantType.Write,
        role: BusinessRole.Director
      });
      const mockedUser = mockUser({ email: 'mockUser@gmail.com', businesses: [mockedUserBusiness] });

      beforeEach(() => {
        verify.mockReset();
        mockingoose(UserModel).toReturn(mockedUser, 'findOne');
        verify.mockResolvedValue({ id: '1111111' });
      });

      test('returns user from authorizationHeader', async () => {
        const result = await validateUser('1111111111');
        expect(result._id).toBe(mockedUser._id);
        expect(result.email).toBe(mockedUser.email);
        expect(result.password).toBe(mockedUser.password);
        expect(result.person).toBe(mockedUser.person);
      });

      test('return user from authorizationHeader and businessId and grantType', async () => {
        const result = await validateUser('1111111111', '123456789012', GrantType.Write);
        expect(result._id).toBe(mockedUser._id);
        expect(result.email).toBe(mockedUser.email);
        expect(result.password).toBe(mockedUser.password);
      });
    });
  });
});

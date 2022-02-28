import { Request, Response, NextFunction } from 'express';
import { createAccessToken } from '../..//utils/token';
import { AppUser } from '../..//entity/AppUser';
import { isAuth } from '../auth';
import createHttpError from 'http-errors';

describe('Auth middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  test('authorisation success', () => {
    mockRequest = {
      headers: {
        authorization: `bearer ${createAccessToken(new AppUser())}`,
      },
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
  });

  test('authorisation fail', () => {
    mockRequest = {
      headers: {
        authorization: 'bearer 123',
      },
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalledWith(createHttpError(401, 'Not authorized'));
  });

  test('empty token', () => {
    mockRequest = {
      headers: {
        authorization: '',
      },
    };
    isAuth(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalledWith(createHttpError(401, 'Not authorized'));
  });
});

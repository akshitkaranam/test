import { AppUser } from '../entity/AppUser';
import { sign } from 'jsonwebtoken';
import { Response } from 'express';

export const createAccessToken = (user: AppUser) => {
  return sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: AppUser) => {
  return sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('cid', token, {
    httpOnly: true,
    path: '/auth/token_refresh',
  });
};

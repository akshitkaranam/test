import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import createHttpError from 'http-errors';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  // get auth token
  const auth = req.headers['authorization'];

  // no token
  if (!auth) {
    next(createHttpError(401, 'Not authorized.'));
    return;
  }

  try {
    // verify token
    const token = auth.split(' ')[1];
    const payload = verify(token, process.env.JWT_ACCESS_SECRET!);
    res.locals.payload = payload as any;
  } catch (err) {
    next(createHttpError(401, 'Not authorized'));
    return;
  }
  next();
};

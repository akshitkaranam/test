import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { HttpError } from 'http-errors';
import { router } from './routes/router';

const app = express();
(async () => {
  app.use(
    cors({
      origin: 'http://localhost:8080',
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  // routes
  app.use('/user', router);

  //error handler
  app.use((err: any, _request: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof HttpError) {
      res.status(err.status).json(err.message);
      return;
    }
    res.status(500).json('Something went wrong');
  });

  await createConnection();
})();

export default app;

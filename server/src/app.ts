import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { HttpError } from 'http-errors';
import restaurantRouter from './routes/restaurantRouter';
import userRouter from './routes/userRouter';

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
  app.use('/user', userRouter);
  app.use('/restaurant',restaurantRouter)

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

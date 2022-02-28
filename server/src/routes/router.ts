import { Router } from 'express';
import restaurantRouter from './restaurantRouter';
import userRouter from './userRouter';

export const router = Router();

router.use('/', userRouter);
router.use('/',restaurantRouter)


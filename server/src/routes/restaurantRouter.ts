import { Router } from 'express';
import { getAllRestaurants, createNewRestaurant } from '../controllers/restaurantController';

const restaurantRouter = Router();

restaurantRouter.route('/').post(createNewRestaurant).get(getAllRestaurants);

export default restaurantRouter;

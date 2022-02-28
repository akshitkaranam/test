import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Restaurant } from '../entity/Restaurant';


// @desc    POST Create a new Restaurant
// @route   /restaurant
// @access  Private
export const createNewRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { name } = req.body;
  
    if (!name) {
      next(createHttpError(401, 'Restaurant Name field cannot be empty!'));
    }
  
    const restaurant = new Restaurant();
    restaurant.name = name;
  
    try {
      await Restaurant.insert(restaurant);
    } catch (err) {
      next(err);
      return;
    }
  
    res.status(201).send(true);
  };
  

  // @desc    Get All Restaurants 
  // @route   /restaurant
  // @access  Private
  export const getAllRestaurants = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const All = await Restaurant.find();
      res.status(201).json(All);
    } catch (err) {
      next(err);
    }
  };
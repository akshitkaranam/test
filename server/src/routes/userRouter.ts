import { Router } from 'express';
import {
  signup,
  login,
  createNewList,
  getAllUsers,
  getAllPersonalLists,
  deleteUser,
  getUserByID,
  updateUserByID,
  deletePersonalLists,
  addRestaurantToList,
  createNewRestaurant,
  getAllRestaurants,
  getListRestaurantsByListID,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/signup', signup);
userRouter.post('/login', login);

userRouter.route('/list/:id').post(createNewList).get(getAllPersonalLists);
userRouter.route('/deleteList/:id').delete(deletePersonalLists);
userRouter.route('/list/:listID/:restaurantID').post(addRestaurantToList);

userRouter.route('/byId/:id').get(getUserByID).put(updateUserByID).delete(deleteUser);
userRouter.get('/listrestaurant/:id', getListRestaurantsByListID);

userRouter.post('/createRestaurant', createNewRestaurant);
userRouter.get('/getAllRestaurant', getAllRestaurants);
export default userRouter;

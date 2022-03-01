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
  // createNewRestaurant,
  // getAllRestaurants,
  getRestaurantsByListID,
  removeRestaurantToList,
  addReview,
} from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/signup', signup);
userRouter.post('/login', login);

userRouter
.route('/list/:id')
.post(createNewList)
.get(getAllPersonalLists);

userRouter.delete('/deleteList/:id',deletePersonalLists)

userRouter
  .route('/list/:listID/:restaurantID')
  .post(addRestaurantToList)
  .put(removeRestaurantToList);

userRouter.route('/byId/:id').get(getUserByID).put(updateUserByID).delete(deleteUser);
userRouter.get('/listrestaurant/:id', getRestaurantsByListID);

userRouter.route('/review/:userId/:restaurantID').post(addReview);

export default userRouter;

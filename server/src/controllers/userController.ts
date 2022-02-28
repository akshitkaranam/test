import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { hash, compare } from 'bcryptjs';
import { AppUser } from '../entity/AppUser';
import { PersonalList } from '../entity/PersonalList';
import { createAccessToken, sendRefreshToken, createRefreshToken } from '../utils/token';
import { validate } from 'class-validator';
import { getConnection } from 'typeorm';
import { ListRestaurant } from '../entity/ListRestaurant';
import { Restaurant } from '../entity/Restaurant';

// @desc    Create New Account
// @route   POST /signup
// @access  Public
export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, firstName, lastName, password, password2 } = req.body;

  // check if all fields exist
  if (!(email && firstName && lastName && password && password2)) {
    next(createHttpError(422, 'Fields cannot be empty'));
    return;
  }

  // check if passwords are the same
  if (password != password2) {
    next(createHttpError(422, 'Passwords do not match'));
    return;
  }

  // check if passwords are at least 8 characters
  if (password.length < 8 || password.length > 50) {
    next(createHttpError(422, 'Password has to be between 8 and 50 characters'));
    return;
  }

  // hash password
  const hashed = await hash(password, 11);

  // create new User
  const user = new AppUser();
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = hashed;

  const errors = await validate(user);
  if (errors.length > 0) {
    let allErrors: string[] = [];
    errors.map(({ constraints }) => {
      if (constraints) allErrors.push(...Object.values(constraints));
    });
    next(createHttpError(422, allErrors.join('\n')));
    return;
  }

  try {
    await AppUser.insert(user);
  } catch (err) {
    // Duplicate email
    if (err.code == 23505) {
      next(createHttpError(409, 'Email already exist'));
    } else {
      next(err);
    }
    return;
  }
  res.status(201).send(true);
};

// @desc    Login User
// @route   POST /login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  if (!(email && password)) {
    next(createHttpError(422, 'Fields cannot be empty'));
  }
  const user = await AppUser.findOne({ where: { email } });

  // email does not registered
  if (!user) {
    next(createHttpError(401, 'Invalid email or password'));
    return;
  }

  // compare hashed passwords
  const validPassword = await compare(password, user.password);

  if (!validPassword) {
    next(createHttpError(401, 'Invalid email or password'));
    return;
  }
  sendRefreshToken(res, createRefreshToken(user));
  res.status(200).json({
    accessToken: createAccessToken(user),
    user: user,
  });
};

// @desc    Get All Users (For Admin UI/ Development Purposes)
// @route   /users
// @access  Private
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const All = await AppUser.find();
    res.status(201).json(All);
  } catch (err) {
    next(err);
  }
};

// @desc    Get User By ID
// @route   GET /users/:id
// @access  Public
export const getUserByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await AppUser.findOne({ where: { id: req.params.id } });
    if (!user) {
      next(createHttpError(401, 'Invalid UserID! Delete Operation Unsuccessful!'));
      return;
    }
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update User By ID
// @route   PUT /users/:id
// @access  Public
export const updateUserByID = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await getConnection()
      .createQueryBuilder()
      .update(AppUser)
      .set({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email })
      .where('id = :id', { id: req.params.id })
      .execute();

    res.status(201).json(true);
  } catch (err) {
    if (err.code == 23505) {
      next(createHttpError(409, 'Email already exist'));
    } else {
      next(err);
    }
  }
};

// @desc    Delete User By ID
// @route   DELETE /users/:id
// @access  Public
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await AppUser.findOne({ where: { id: req.params.id } });
    if (!user) {
      next(createHttpError(401, 'Invalid UserID! Delete Operation Unsuccessful!'));
      return;
    }

    const userDeleted = await AppUser.delete({ id: req.params.id });

    if (userDeleted) {
      res.status(201).send(true);
    } else {
      next(createHttpError(401, 'Could not delete User!'));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Create New List By User ID
// @route   POST /list/:id
// @access  Private
export const createNewList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { listName } = req.body;
  const userID: any = req.params.id;
  if (!listName) {
    next(createHttpError(401, 'List Name field cannot be empty!'));
  }

  const list = new PersonalList();
  list.userID = userID;
  list.listName = listName;

  const errors = await validate(list);
  if (errors.length > 0) {
    let allErrors: string[] = [];
    errors.map(({ constraints }) => {
      if (constraints) allErrors.push(...Object.values(constraints));
    });
    next(createHttpError(422, allErrors.join('\n')));
    return;
  }

  try {
    await PersonalList.insert(list);
  } catch (err) {
    next(err);
    return;
  }

  res.status(201).send(true);
};

// @desc    Get Lists By User ID
// @route   GET /list/:id
// @access  Private
export const getAllPersonalLists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // const userID: any = req.params.id;

  try {
    const All = await PersonalList.find({ where: { userID: req.params.id } });
    res.status(201).json(All);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete List by List ID
// @route   GET /list/:id
// @access  Private
export const deletePersonalLists = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userDeleted = await PersonalList.delete({ id: req.params.id });
    res.status(201).json(userDeleted);
  } catch (err) {
    next(err);
  }
};

// @desc    Add Restaurant to List by List ID
// @route   POST /list/:listID/:restaurantID
// @access  Private
export const addRestaurantToList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { listID, restaurantID }: any = req.params;

  try {
    const currentListRestaurants = await ListRestaurant.find({
      relations: ['personalList', 'restaurants'],
    });
    
    if(currentListRestaurants){
      currentListRestaurants.forEach((x) => {
        x.restaurants.forEach((y) => {
          if(y.id === restaurantID){
            next(createHttpError(401,"Restaurant already exists in list!"))
          }
        })
      })  
    }
   
    const list = await PersonalList.find({ where: { id: listID } });
    const restaurant = await Restaurant.find({ where: { id: restaurantID } });
    const listRestaurant = new ListRestaurant();
    listRestaurant.addPersonalList(list[0]);
    listRestaurant.addRestaurant(restaurant[0]);
    const r = await ListRestaurant.save(listRestaurant);

    res.status(201).json(r);
  } catch (err) {
    next(err);
    return;
  }
};

// @desc    Get Lists By User ID
// @route   GET /listrestaurant/:id
// @access  Private
export const getListRestaurantsByListID = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {

  console.log('reachd here');
  try {
    const currentListRestaurants = await ListRestaurant.find({
      relations: ['personalList', 'restaurants'],
      // where: {
      //   personalList:{id: req.params.id}
      // }
    });
    res.status(201).json(currentListRestaurants)
    
  } catch (err) {
    next(err);
  }
};

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

// @desc    Get All Users (For Admin UI/ Development Purposes)
// @route   /users
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
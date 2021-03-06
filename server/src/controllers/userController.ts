import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { hash, compare } from 'bcryptjs';
import { AppUser } from '../entity/AppUser';
import { PersonalList } from '../entity/PersonalList';
import { createAccessToken, sendRefreshToken, createRefreshToken } from '../utils/token';
import { validate } from 'class-validator';
import { getConnection } from 'typeorm';
import { Restaurant } from '../entity/Restaurant';
import { Review } from '../entity/Review';

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

// @desc    Login User (READ)
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

// @desc    (READ) Get All Users (For Admin UI/ Development Purposes)
// @route   GET /users
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

// @desc    Get (READ) User By ID
// @route   GET /users/byId/:id
// @access  Private
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
// @route   PUT /users/byId/:id
// @access  Private
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
// @route   DELETE /users/byId/:id
// @access  Private
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

// @desc    Read Lists By User ID
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

// @desc    Update List using ListID
// @route   PUT /list/:id
// @access  Private
export const updateList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { listName } = req.body;
  const listID: any = req.params.id;
  if (!listName) {
    next(createHttpError(401, 'List Name field cannot be empty!'));
  }

  const requiredList = await PersonalList.find({where: {id: listID}})
  requiredList[0].listName = listName
  const errors = await validate(requiredList[0]);
  
  if (errors.length > 0) {
    let allErrors: string[] = [];
    errors.map(({ constraints }) => {
      if (constraints) allErrors.push(...Object.values(constraints));
    });
    next(createHttpError(422, allErrors.join('\n')));
    return;
  }

  try {
    await PersonalList.save(requiredList);
  } catch (err) {
    next(err);
    return;
  }
  res.status(201).send(true);
};


// @desc    Delete List by List ID
// @route   DELETE /list/:id
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

// @desc    Create (ADD) Restaurant to List by List ID, Restaurant ID
// @route   POST /list/:listID/:restaurantID
// @access  Private
export const addRestaurantToList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { listID, restaurantID }: any = req.params;

  try {
    const list = await PersonalList.find({ where: { id: listID } });
    const restaurant = await Restaurant.find({ where: { id: restaurantID } });

    list[0].restaurants.forEach((x) => {
      if (x.id === restaurantID) {
        next(createHttpError('401', 'Restaurant already present in list!'));
      }
    });

    list[0].addRestaurant(restaurant[0]);
    await PersonalList.save(list);
    res.status(201).json(true);
  } catch (err) {
    next(err);
    return;
  }
};


// @desc    Read 'ListRestaurant' to get all Restaurants by ListID
// @route   GET list/listrestaurant/:id
// @access  Private
export const getRestaurantsByListID = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const personalList = await PersonalList.find({
      relations: ['restaurants'],
    });
    res.status(201).json(personalList);
  } catch (err) {
    next(err);
  }
};


// @desc    Update -> Remove Restaurant fom List by List ID, RestaurantID
// @route   PUT /list/:listID/:restaurantID
// @access  Private
export const removeRestaurantToList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { listID, restaurantID }: any = req.params;

  try {
    const list = await PersonalList.find({ where: { id: listID } });
    let found:boolean = false;
    list[0].restaurants.forEach((x) => {
      if (x.id === restaurantID) {
        found = true
        console.log("Found! ")
        list[0].removeRestaurant(x.id)
        // console.log(list[0])
      }
    });

    if(!found){
      next(createHttpError(401,"Restaurant not added to Personal List"))
    }
    await PersonalList.save(list);
    res.status(201).json(true);
  } catch (err) {
    next(err);
    return;
  }
};

// @desc    Create (ADD) Review to Restaurant and User by List ID, Restaurant ID
// @route   POST /review/:userID/:restaurantID
// @access  Private
export const addReview = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {

  
  const { userID, restaurantID }: any = req.params;
  const {rating, text, totalPrice, pax}: any = req.body;
  
  try{
    if (!(rating && text && totalPrice && pax)) {
      next(createHttpError(422, 'Fields cannot be empty'));
      return;
    }

    console.log(rating)
    console.log(text)
    console.log(totalPrice)
    console.log(pax)
  
    const review = new Review()
    review.rating = rating
    review.text = text
    review.totalPrice = parseFloat(totalPrice)
    review.pax = pax
  
    const errors = await validate(review);
    if (errors.length > 0) {
      let allErrors: string[] = [];
      errors.map(({ constraints }) => {
        if (constraints) allErrors.push(...Object.values(constraints));
      });
      next(createHttpError(422, allErrors.join('\n')));
      return;
    }

    const user = await AppUser.find({ where: { id: userID } });
    const restaurant = await Restaurant.find({ where: { id: restaurantID } });
    review.restaurant = restaurant[0]
    review.user = user[0]
    // await Review.insert(review)

  } catch (err) {
    next(err);
    return;
  }
  
}







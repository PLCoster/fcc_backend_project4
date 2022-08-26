const User = require('../models/User');
const Exercise = require('../models/Exercise');

const middleware = {};

// Takes 'username' parameter from req.body and creates a new user
// Adds new user document to res.locals.userDocument
middleware.createUser = (req, res, next) => {
  const username = req.body.username;

  if (!username) {
    return res.json({ error: 'A non-empty username is required!' });
  }

  // Create a new user and return user info:
  User.create({ username })
    .then((document) => {
      console.log('MADE USER: ', document);
      res.locals.userDocument = document;
      return next();
    })
    .catch((err) => {
      console.error('Error when trying to create a new user: ', err);
      return res.json({ error: 'Error when trying to create a new user' });
    });
};

// Gets all users from DB
// Adds all user documents to res.locals.userDocumentArray
middleware.getAllUsers = (req, res, next) => {
  // Find all Users, show _id and username fields
  User.find({})
    .select('_id username')
    .exec()
    .then((documents) => {
      console.log(documents);
      res.locals.userDocumentArray = documents;
      next();
    })
    .catch((err) => {
      console.error('Error when trying to get all Users: ', err);
      return res.json({ error: 'Error when trying to get all Users' });
    });
};

// Creates a new Exercise Document if User ID exists, and Exercise Info Complete
middleware.createExercise = (req, res, next) => {
  console.log(req.params);
  const user_id = req.params._id;
  let { description, duration, date } = req.body;

  console.log(user_id, description, duration, date);

  // If date is not defined, use current date:
  if (!date) {
    date = Date.now();
  } else {
    date = new Date(date).getTime();
  }

  if (!user_id || !description || !duration || date === 'Invalid Date') {
    return res.json({
      error:
        '_id, description, duration and a valid date are required to create an Exercise',
    });
  }

  // Find the User in the DB:
  User.findById(user_id)
    .exec()
    .then((userDocument) => {
      if (!userDocument) {
        return Promise.reject(`User with _id ${user_id} not found`);
      }

      // Otherwise User has been found, create the exercise:
      res.locals.userDocument = userDocument;
      return Exercise.create({
        user_id: userDocument._id,
        description,
        duration,
        date,
      });
    })
    .then((exerciseDocument) => {
      res.locals.exerciseDocument = exerciseDocument;
      return next();
    })
    .catch((err) => {
      console.error('Error when trying to create a new exercise: ', err);
      return res.json({
        error: `Error when trying to create a new exercise: ${err}`,
      });
    });
};

module.exports = middleware;

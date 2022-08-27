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

// Get a single user by their id from query parameter
// If the user is found, adds their User document to res.locals.userDocument
middleware.getUserById = (req, res, next) => {
  const user_id = req.params._id;

  if (!user_id || user_id.length !== 24) {
    // _id length is 12 bytes (2^96) = 24 hexadecimal chars (16^24 = (2^4)^24 = 2^96)
    return res.json({
      error: 'Valid _id is required to create an Exercise',
    });
  }

  // Find the User in the DB:
  User.findById(user_id)
    .exec()
    .then((userDocument) => {
      if (!userDocument) {
        return res.json({
          error: `User with _id ${user_id} not found`,
        });
      }

      // Otherwise User has been found, add to locals, move to next middleware
      res.locals.userDocument = userDocument;
      next();
    })
    .catch((err) => {});
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
// Requires getUserById middleware to be called first and successfully find the User
// Adds new Exercise document to res.locals.exerciseDocument
middleware.createExercise = (req, res, next) => {
  const user_id = res.locals.userDocument._id;
  let { description, duration, date } = req.body;

  console.log('TRYING TO CREATE EXERCISE:');
  console.log(user_id, description, duration, date);

  let numericDuration = true;
  // Ensure duration is an integer, otherwise set null to return error result json:
  if (!/[0-9]+/.test(duration)) {
    numericDuration = false;
  }

  // If date is not defined, use current date:
  let unixDate;
  let validDate = true;
  if (!date) {
    unixDate = Date.now();
  } else {
    // Ensure date matches YYYY-MM-DD format
    if (!/[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9]/.test(date)) {
      validDate = false;
    } else {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      unixDate = dateObj.getTime();
    }
  }

  console.log(numericDuration, validDate);

  if (!description || !numericDuration || !validDate) {
    return res.json({
      error:
        'Description (string), duration (number) and a valid date (YYYY-MM-DD) are required to create an Exercise',
      description,
      duration,
      date,
    });
  }

  Exercise.create({ user_id, description, duration, date })
    .then((exerciseDocument) => {
      res.locals.exerciseDocument = exerciseDocument;
      return next();
    })
    .catch((err) => {
      console.error('Error when trying to create a new exercise: ', err);
      return res.json({
        error: `Error when trying to create a new exercise`,
      });
    });
};

// Gathers all Exercise Documents for a given User _id (user_id in Exercise)
// Applies filters if present in query parameters
// Requires etUserById middleware to be called first and successfully find the User
// Adds all Exercise documents to res.locals.exerciseDocumentArray
middleware.getFilteredExercisesByUserId = (req, res, next) => {
  const user_id = res.locals.userDocument._id;

  const { from, to, limit } = req.query;

  // If limit is not an integer, return an error
  if (limit && !/^[0-9]+$/.test(limit)) {
    return res.json({
      error: `Invalid limit given when requesting exercises: LIMIT: ${limit}`,
    });
  }

  const dateRequirements = { $gte: 0 };
  if (from) {
    dateRequirements.$gte = new Date(from).getTime();
  }

  if (to) {
    dateRequirements.$lte = new Date(to).getTime();
  }

  // If either time is invalid (NaN time), return an error:
  if (
    (from && isNaN(dateRequirements.$gte)) ||
    (to && isNaN(dateRequirements.$lte))
  ) {
    return res.json({
      error: `Invalid date given for from or to: FROM: ${from || 'N/A'}, TO: ${
        to || 'N/A'
      }`,
    });
  }

  Exercise.find({ user_id, date: dateRequirements })
    .sort('-date')
    .limit(limit ? parseInt(limit) : null)
    .then((exerciseDocuments) => {
      res.locals.exerciseDocumentArray = exerciseDocuments;
      next();
    })
    .catch((err) => {
      console.error(
        'Error when trying to find all exercises by User Id: ',
        err,
      );
      return res.json({
        error: `Error when trying to find all exercises by User Id`,
      });
    });
};

module.exports = middleware;

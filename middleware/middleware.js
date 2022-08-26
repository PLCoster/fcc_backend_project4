const User = require('../models/User');

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

module.exports = middleware;

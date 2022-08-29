# Free Code Camp: Backend Project 4 - Exercise Tracker

## Exercise Tracker

The aim of this project was to build a small web app with functionality similar to: https://exercise-tracker.freecodecamp.rocks

The project was built using the following technologies:

- **HTML**
- **JavaScript** with **[Node.js](https://nodejs.org/en/) / [NPM](https://www.npmjs.com/)** for package management.
- **[Express](https://expressjs.com/)** web framework to build the web API.
- **[mongoose](https://mongoosejs.com/)** for MongoDB object modeling, interacting with a **[MongoDB Atlas](https://www.mongodb.com/atlas/database)** database.
- **[Bootstrap](https://getbootstrap.com/)** for styling with some custom **CSS**.
- **[FontAwesome](https://fontawesome.com/)** for icons.
- **[nodemon](https://nodemon.io/)** for automatic restarting of server during development.

### Project Requirements:

- **User Story #1:** You can `POST` to `/api/users` with form data `username` to create a new user.

- **User Story #2:** The returned response from `POST /api/users` with form data `username` will be an object with `username` and `_id` properties.

- **User Story #3:** You can make a `GET` request to `/api/users` to get a list of all users.

- **User Story #4:** The `GET` request to `/api/users` returns an array.

- **User Story #5:** Each element in the array returned from `GET /api/users` is an object literal containing a user's `username` and `_id`.

- **User Story #6:** You can `POST` to `/api/users/:_id/exercises` with form data `description`, `duration`, and optionally `date`. If no date is supplied, the current date will be used.

- **User Story #7:** The response returned from POST `/api/users/:_id/exercises` will be the user object with the exercise fields added.

- **User Story #8:** You can make a GET request to `/api/users/:_id/logs` to retrieve a full exercise log of any user.

- **User Story #9:** A request to a user's log `GET /api/users/:_id/logs` returns a user object with a `count` property representing the number of exercises that belong to that user.

- **User Story #10:** A `GET` request to `/api/users/:_id/logs` will return the user object with a `log` array of all the exercises added.

- **User Story #11:** Each item in the `log` array that is returned from `GET /api/users/:_id/logs` is an object that should have a `description`, `duration`, and `date` properties.

- **User Story #12:** The `description` property of any object in the `log` array that is returned from `GET /api/users/:_id/logs` should be a string.

- **User Story #13:** The `duration` property of any object in the `log` array that is returned from `GET /api/users/:_id/logs` should be a number.

- **User Story #14:** The `date` property of any object in the log array that is returned from `GET /api/users/:_id/logs` should be a string. Use the `dateString` format of the Date API.

- **User Story #15:** You can add `from`, `to` and `limit` parameters to a `GET /api/users/:_id/logs` request to retrieve part of the log of any user. `from` and `to` are dates in `yyyy-mm-dd` format. `limit` is an integer of how many logs to send back.

### Project Writeup:

The fourth Free Code Camp: Back End Development Project is an Exercise Tracker API. Users can:

- Create a new User by submitting the form on the app home page, or by sending a POST request to `/api/users` with a body containing a url encoded field of 'username'.

- View all Users by sending a GET request to `/api/users`

- Add an Exercise to a User Account by submitting an Exercise using the 'Add Exercise' form on the app home page. Alternatively, by sending a POST request to `/api/users/<USER_ID>/exercises` with a valid USER_ID, and a body containing url encoded fields of 'description' (string), 'duration' (integer) and 'date' (optional, YYYY-MM-DD).

- View a User's Exercise Log by sending a GET request to `/api/users/:_id/logs?[from][&to][&limit]`, where `[]` denote optional filter query parameters, and `from`, `to` = dates (yyyy-mm-dd); `limit` = number.

User IDs and their Exercises are stored in a MongoDB database, and expire after 24hrs for Demo purposes.

### Project Files

- `index.js` - the main entry point of the application, an express web server handling the routes defined in the specification.

- `public/` - contains static files for the web app (stylesheet, logo, favicons etc), served by express using `express.static()`.

- `views/` - contains the single html page for the web app, `index.html`, which is served by express on `GET` requests to `/`.

- `middleware/` - contains express middleware functions used by the routes of the express server.

- `models/` - contains `mongoose` schema and models for the database interactions of the app.

### Usage:

Requires Node.js / NPM in order to install required packages. After downloading the repo, install required dependencies with:

`npm install`

To run the app locally, a valid MongoDB database URI is required to be entered as an environmental variable (MONGO_URI), which can be done via a `.env` file (see sample.env). One possible MongoDB service is **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**.

A development mode (with auto server restart on file save), can be started with:

`npm run dev`

The application can then be viewed at `http://localhost:3000/` in the browser.

To start the server without auto-restart on file save:

`npm start`

# Exercise Tracker BoilerPlate

The initial boilerplate for this app can be found at https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/

Instructions for building the project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker

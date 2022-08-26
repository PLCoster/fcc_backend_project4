// .env file can hold PORT / MONGO_URI variable if desired
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { createUser } = require('./middleware/middleware');

const app = express();

// Log incoming requests in development:
if (process.env.RUN_MODE === 'development') {
  app.use((req, res, next) => {
    console.log(
      `${req.method} ${req.path}; IP=${req.ip}; https?=${req.secure}`,
    );
    next();
  });
}

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
app.use(cors());

// Parse url encoded bodies:
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from 'public' folder
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Send index.html on requests to root
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// POST request to `/api/users` to create a new user:
app.post('/api/users', createUser, (req, res) => {
  const { _id, username } = res.locals.userDocument;
  return res.json({ _id, username });
});

// 404 page not found:
app.get('*', (req, res) => {
  // Redirect to index
  res.redirect('/');
});

// Internal Error Handler:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server error: See Server Logs');
});

// Have server listen on PORT or default to 3000
// http://localhost:3000/
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Set up mongoose connection to MONGO DB:
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error');
  });

// Schema for App User
const userSchema = new mongoose.Schema({
  username: String,
  createdAt: { type: Date, expires: 86400, default: Date.now }, // Auto Expire document after 1 day
});

const User = mongoose.model('user', userSchema);

module.exports = User;

const mongoose = require('mongoose');

mongoose.connect(
  process.env.NODE_ENV === 'development'
  ? process.env.MONGODB_DEV_TEST_URI
  : 'mongodb://localhost:27017' || process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, done) => {
    if (err) {
      console.log('Database connection failed');
    } else {
      console.log('Database connection successfull');
    }
  }
);

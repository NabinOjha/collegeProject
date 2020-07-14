const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017' || process.env.MONGODB_URI,
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

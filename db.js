const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI,
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

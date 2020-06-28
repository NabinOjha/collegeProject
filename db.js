const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://127.0.0.1:27017/jobPortal',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  (err, done) => {
    if (err) {
      console.log('Database connection failed');
    } else {
      console.log('Database connection successfull');
    }
  }
);

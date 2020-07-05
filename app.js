const express = require('express');
const dotenv = require('dotenv');
// const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const jobApplicationRoute = require('./routes/jobApplicationRoute');
const categoriesRoutes = require('./routes/categoriesRoutes');
const globalErrorHandler = require('./controllers/errorContoller');

// read environment variables from .env file
dotenv.config({ path: './config.env' });

//connect to the datebase
require('./db');

//run the express app to set up server
const app = express();

const PORT = process.env.PORT || 9000;

//serve static files

// app.use(express.static('public/img'));
app.use(express.static('public'));

//accept the cross origin request
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

//json parser
app.use(express.json());
//parse the cookies sent by the browser
app.use(cookieParser());

//url encoded body data parser
app.use(express.urlencoded({ extended: true }));

//Testing MiddleWare
app.use((req, res, next) => {
  console.log(req.originalUrl);
  console.log('Test Middleware');
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', jobApplicationRoute);
app.use('/api/categories', categoriesRoutes);

//global error handler
app.use(globalErrorHandler);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}

//Run the api on PORT
app.listen(PORT, () => {
  console.log(`App running at port ${PORT}`);
});

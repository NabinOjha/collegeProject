const jwt = require('jsonwebtoken');

const User = require('./../model/userModel');
const Jobs = require('./../model/jobModel');
const upload = require('./../utils/uploadFIles');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.photoUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

exports.register = catchAsync(async (req, res, next) => {
  const bodyObj = { ...req.body };
  const uploadedFiles = { ...req.files };
  for (let [key, value] of Object.entries(uploadedFiles)) {
    bodyObj[key] = value[0].filename;
  }

  if (req.file) bodyObj.image = req.file.filename;
  const admin = await User.findOne({ role: 'admin' });
  if (admin && req.body.role === 'admin') return next('Admin already exist');
  if (req.body.role === 'admin' || req.body.role === 'employer')
    bodyObj.resume = undefined;
  const user = await User.create(bodyObj);
  if (!user) return next(new AppError('User could not be creadted!', 400));
  const token = await jwt.sign({ payload: user.id }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
  res.status(200).json({
    user,
    token,
    message: 'success',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError('User with this email does not exist!', 400));
  if (await user.comparePassword(user.password, password)) {
    const token = await jwt.sign({ payload: user.id }, process.env.JWT_SECRET, {
      expiresIn: '10d',
    });
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      token,
      user,
    });
  } else {
    return next(new AppError('Wrong Password.Please try again!', 400));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.payload);
    req.user = currentUser;
    next();
  } else if (req.cookies) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You cannot access this route!.Log in to get access.', 401)
    );
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.payload);
  req.user = user;
  next();
});

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(200).json({
        loggedIn: false,
        user: null,
      });
    } else {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.payload);
      res.status(200).json({
        loggedIn: true,
        user,
      });
    }
  } catch (error) {
    return res.status(200).json({
      loggedIn: false,
      user: null,
    });
  }
};
exports.logOut = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    message: 'Logged out successfully',
  });
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      return next(new AppError('You cannot access this route', 401));
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.params.id).select('+password');
  const checkPassword = await user.comparePassword(user.password, password);

  if (!checkPassword)
    return next(new AppError('Plesee provide the correct password!', 401));
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  const updatedUser = await user.save();
  const token = await jwt.sign({ payload: user.id }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  res.status(200).json({
    updatedUser,
    token,
    message: 'success',
  });
});

exports.checkUserExist = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    let token;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next();
    } else {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.payload);
      if (!user) return next();
      req.user = user;

      return next();
    }
  } catch (error) {
    return next();
  }
};

exports.jobsActionAllowedUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user;
  const jobNndck = await Jobs.findById(id);

  const job = await Jobs.findById(id).populate({
    path: 'createdBy',
    select: 'userName',
  });

  if (!(currentUser.id === job.createdBy.id))
    return next(new AppError('You cannot update  this job', 401));
  next();
});

exports.getAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    return res.status(200).json({
      admin: null,
    });
  }
  res.status(200).json({
    admin,
  });
});

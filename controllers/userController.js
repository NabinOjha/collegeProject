const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) return next(new AppError('Users not found!', 404));
  res.status(200).json({
    data: users,
    message: 'success',
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({
    data: user,
    message: 'success',
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const data = { ...req.body };
  const { id } = req.params;

  if (req.files) {
    for (let [key, value] of Object.entries(req.files)) {
      data[key] = value[0].filename;
    }
  }
  if (req.file) data.image = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
    // runValidators: true,
  });

  if (!updatedUser) return next(new AppError('User could not be updated', 400));
  res.status(200).json({
    updatedUser,
    message: 'success',
  });
});

exports.getEmployers = catchAsync(async (req, res, next) => {
  const employers = await User.find({ role: 'employer' });
  if (!employers) return next(new AppError('Employers not found!', 404));
  res.status(200).json(employers);
});

exports.downloadResume = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  const resume = user.resume;

  res.download(`${process.cwd()}/public/resume/${resume}`, (err) => {
    console.log(err);
  });
});

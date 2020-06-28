const Categories = require('./../model/jobCategoryModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createCategory = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  if (req.files) {
    for (let [key, value] of Object.entries(req.files)) {
      body.icon = value[0].filename;
    }
  }
  if (req.file) body.icon = req.file.filename;
  const category = await Categories.create(body);
  res.status(201).json({
    category,
    message: 'success',
  });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Categories.find();
  if (!categories)
    return next(new AppError('Categories cannot be fetched!', 404));
  res.status(200).json({
    message: 'success',
    categories,
  });
});

exports.getJobByCategory = catchAsync(async (req, res, next) => {
  const category = await Categories.findById(req.params.id).populate('jobs');
  if (!category) return next(new AppError('Category does not exist!', 404));
  res.status(200).json(category);
});

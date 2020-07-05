// const Job = require('./../model/jobModel');
// const User = require('./../model/userModel');
// // const JobApplication = require('./../model/applicationModel');

// const AppError = require('./../utils/AppError');
// const catchAsync = require('../utils/catchAsync');
// // console.log('Hello')

// exports.setUserIdsAndCheckUserAlreadyApplied = catchAsync(
//   async (req, res, next) => {
//     const { jobId } = req.params;
//     const job = await Job.findById(jobId);

//     const employer = job.createdBy;
//     const employee = req.user._id;

//     const dataObj = { jobId, employer, employee };
//     req.dataObj = dataObj;

//     // check if the loggedIn employee has already applied for the job
//     if (job.appliedBy.includes(employee))
//       return next(new AppError('You have already applied for this job', 400));
//     next();
//   }
// );

// exports.createJobApplication = catchAsync(async (req, res, next) => {
//   const currentUser = await User.findById(req.dataObj.employee);
//   if (!currentUser.resume) {
//     return next(new AppError('Upload an resume to apply for this job!', 400));
//   }
//   // const jobApplication = await JobApplication.create(req.dataObj);
//   res.status(200).json({
//     data: jobApplication,
//     message: 'success',
//   });
// });

// exports.getAllJobApplications = catchAsync(async (req, res, next) => {
//   const jobApplications = await JobApplication.find({}).populate([
//     { path: 'employer', select: 'userName , associatedCompany' },
//     { path: 'employee', select: 'userName' },
//   ]);
//   if (!jobApplications)
//     return next(new AppError('Application does not exist', 404));

//   res.status(200).json({
//     message: 'suucess',
//     data: jobApplications,
//   });
// });

// exports.getOneJobApplication = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   // const jobApplication = await JobApplication.findById(id);
//   if (!jobApplication)
//     return next(new AppError('Application does not exist!', 404));

//   res.status(200).json({
//     status: 'success',
//     data: jobApplication,
//   });
// });

// exports.updateJobApplication = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const updatedJobApplication = await JobApplication.findByIdAndUpdate(
//     id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!updatedJobApplication)
//     return next(
//       new AppError('Updating application failed .Please try again later!', 404)
//     );
//   res.status(200).json({
//     message: 'success',
//     data: updatedJobApplication,
//   });
// });

// exports.deleteJobApplication = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   await JobApplication.findByIdAndDelete(id);
//   res.status(200).json({
//     message: 'success',
//     data: null,
//   });
// });

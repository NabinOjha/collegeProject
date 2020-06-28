const express = require('express');
const jobsApplicationRouter = require('./jobApplicationRoute');
const authController = require('./../controllers/authController');
const jobsController = require('./../controllers/jobsContoller');
const Jobs = require('./../model/jobModel');

const router = express.Router({ mergeParams: true });

router.get('/categories', jobsController.getCategories);
router.get('/trending', jobsController.trendingJobs);
router.get('/search', jobsController.searchJobs);

router.use('/:jobId/applications', jobsApplicationRouter);

router
  .route('/')
  .get(
    authController.checkUserExist,
    jobsController.getRatingsDataOfJobsForEachUser,
    jobsController.getRecommededJobs,
    jobsController.getAllJobs
  )
  .post(
    authController.protect,
    authController.restrictTo('employer', 'admin'),
    authController.photoUpload,
    jobsController.createJob
  );

router
  .route('/:id')
  .get(
    // authController.protect,
    authController.checkUserExist,
    jobsController.getOneJob
  )
  .patch(
    authController.photoUpload,
    authController.protect,
    authController.jobsActionAllowedUser,
    jobsController.updateJob
  )
  .delete(
    authController.protect,
    authController.jobsActionAllowedUser,
    jobsController.deleteJob
  );

module.exports = router;

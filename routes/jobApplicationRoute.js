const express = require('express');

const jobApplicationController = require('./../controllers/jobApplicationContoller');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(
    authController.restrictTo('employer'),
    jobApplicationController.getAllJobApplications
  )
  .post(
    authController.protect,
    authController.restrictTo('employee'),
    jobApplicationController.setUserIdsAndCheckUserAlreadyApplied,
    jobApplicationController.createJobApplication
  );

router.use(authController.jobsActionAllowedUser);

router
  .route('/:id')
  .get(jobApplicationController.getOneJobApplication)
  .patch(jobApplicationController.updateJobApplication)
  .delete(jobApplicationController.deleteJobApplication);

module.exports = router;

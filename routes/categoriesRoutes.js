const express = require('express');

const categoriesController = require('../controllers/categoriesContoller');
const authController = require('../controllers/authController');
const jobRouter = require('./jobsRoutes');

const router = express.Router();

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    authController.photoUpload,
    categoriesController.createCategory
  )
  .get(categoriesController.getCategories);

router.route('/:id').get(categoriesController.getJobByCategory);

module.exports = router;

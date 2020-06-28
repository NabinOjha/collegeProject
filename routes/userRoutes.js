const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', authController.photoUpload, authController.register);
router.get('/admin', authController.getAdmin);
router.post('/login', authController.login);
router.get('/logout', authController.logOut);
router.get('/loggedIn', authController.getCurrentUser);
router.get('/employers', userController.getEmployers);

router.get(
  '/:id/downloadResume',
  authController.protect,
  userController.downloadResume
);

router.patch(
  '/updatePassword/:id',
  authController.protect,
  authController.updatePassword
);

router.route('/').get(authController.protect, userController.getUsers);

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.photoUpload,
    userController.updateMe
  )
  .get(userController.getUser);

module.exports = router;

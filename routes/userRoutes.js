const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

const router = express.Router();

router
  .route('/')
  .get(protect, userController.getAllUsers)
  .post(protect, userController.createUser);

router
  .route('/me')
  .get(protect, userController.getMe, userController.getUser)
  .patch(
    protect,
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe,
  )
  .delete(protect, userController.deleteMe);

router
  .route('/:id')
  .get(protect, userController.getUser)
  .patch(protect, restrictTo('admin'), userController.updateUser)
  .delete(protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;

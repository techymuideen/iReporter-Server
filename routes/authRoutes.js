const express = require('express');
const authController = require('../controllers/authController');
const protect = require('../middlewares/protect');

const router = express.Router();

router.get('/google', authController.googleAuth);
router.post('/signup', authController.signup);
router.post('/complete-signup/:token', authController.completeSignup);

router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword/:token', authController.resetPassword);
router.post('/updatepassword', protect, authController.updatePassword);
router.get('/logout', authController.logout);

module.exports = router;

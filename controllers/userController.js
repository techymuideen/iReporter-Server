const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const storage = require('../storage/storage');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image.', 400), false);
  }
};

// Initialize multer with storage and filter
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

// Middleware for uploading report files
exports.uploadUserPhoto = upload.fields([{ name: 'photo', maxCount: 1 }]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  try {
    // Check if req.files exists and contains the expected files
    if (req.files) {
      // Process images if they exist
      if (req.files.photo) {
        req.body.photo = req.files.photo[0].path;
      }
    } else {
      // If no files are uploaded, throw an AppError
      return next(new AppError('No files were uploaded', 400));
    }

    next();
  } catch (err) {
    console.error('File upload error:', err); // Log error for debugging
    return next(new AppError('Failed to upload files', 400)); // Use AppError instead of Error
  }
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'firstname',
    'lastname',
    'othernames',
    'phoneNumber',
    'username',
    'email',
    'photo',
  );
  if (req.file) filteredBody.photo = req.body.photo;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

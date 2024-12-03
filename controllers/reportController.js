const multer = require('multer');
const storage = require('../storage/storage');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Report = require('../models/reportModel');
const factory = require('./handlerFactory');

// Multer filter to check file type
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Not an image or video! Please upload only images or videos.',
        400,
      ),
      false,
    );
  }
};

// Initialize multer with storage and filter
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

// Middleware for uploading report files
exports.uploadReportFiles = upload.fields([
  { name: 'videos', maxCount: 4 },
  { name: 'images', maxCount: 4 },
]);

// Middleware to process uploaded files
exports.handleReportFiles = catchAsync(async (req, res, next) => {
  try {
    req.body.images = [];
    req.body.videos = [];

    // Check if req.files exists and contains the expected files
    if (req.files) {
      // Process images if they exist
      if (req.files.images) {
        req.body.images = req.files.images.map(file => file.path);
      }

      // Process videos if they exist
      if (req.files.videos) {
        req.body.videos = req.files.videos.map(file => file.path);
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

// Factory Handlers for CRUD operations
exports.createReport = factory.createOne(Report);
exports.getAllReports = factory.getAll(Report);
exports.getReport = factory.getOne(Report, {
  path: 'createdBy',
  select: ['-createdAt', '-passwordChangedAt', '-__v'],
});

exports.updateReport = factory.updateOne(Report);

exports.deleteReport = factory.deleteOne(Report);

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
  console.log('Reading files');

  req.body.images = [];
  req.body.videos = [];

  // Process images
  if (req.files.images) {
    req.body.images = req.files.images.map(file => file.path);
  }

  // Process videos
  if (req.files.videos) {
    req.body.videos = req.files.videos.map(file => file.path);
  }

  next();
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

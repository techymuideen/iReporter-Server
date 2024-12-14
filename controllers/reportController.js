const multer = require('multer');
const storage = require('../storage/storage');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Report = require('../models/reportModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');

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
    const existingImages = req.body.existingImages
      ? JSON.parse(req.body.existingImages)
      : [];

    const existingVideos = req.body.existingVideos
      ? JSON.parse(req.body.existingVideos)
      : [];

    // Initialize req.body.images with existing images
    req.body.images = existingImages;
    req.body.videos = existingVideos;

    // Check if req.files exists and contains the expected files
    if (req.files) {
      // Process images if they exist
      if (req.files.images) {
        const newImagePaths = req.files.images.map(file => file.path);
        req.body.images = [...req.body.images, ...newImagePaths];
      }

      // Process videos if they exist
      if (req.files.videos) {
        const newVideoPaths = req.files.videos.map(file => file.path);
        req.body.videos = [...req.body.videos, ...newVideoPaths];
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

exports.addAuthor = catchAsync(async (req, res, next) => {
  if (!req.body.createdBy) req.body.createdBy = req.user.id;
  next();
});

// Factory Handlers for CRUD operations
exports.createReport = factory.createOne(Report);

exports.getAllReports = catchAsync(async (req, res, next) => {
  const totalReports = new APIFeatures(Report.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const count = await totalReports.query.countDocuments();

  // Execute query

  let features;
  if (!req.user.isAdmin) {
    features = new APIFeatures(
      Report.find({ createdBy: req.user.id }),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }

  if (req.user.isAdmin) {
    features = new APIFeatures(Report.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }

  const reports = await features.query;

  // Send Response
  res.status(200).json({
    status: 'sucess',
    result: reports.length,
    data: {
      reports: reports,
      count: count,
    },
  });
});

// exports.getAllReports = factory.getAll(Report);
exports.getReport = factory.getOne(Report, {
  path: 'createdBy',
  select: ['-createdAt', '-passwordChangedAt', '-__v'],
});

exports.updateReport = factory.updateOne(Report);

exports.deleteReport = factory.deleteOne(Report);
